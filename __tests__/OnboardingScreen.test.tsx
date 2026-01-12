import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import {Alert} from 'react-native';
import {http, HttpResponse} from 'msw';
import {setupServer} from 'msw/node';
import OnboardingScreen from '../src/screens/OnboardingScreen';

// Mock Alert.alert to prevent real alerts during tests
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// MSW server setup for API mocking
const server = setupServer();

beforeAll(() => server.listen({onUnhandledRequest: 'warn'}));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Helper to get the pressable container (since SubmitButton is wrapped)
const getCreateProfileContainer = () => {
  const label = screen.getByText('Submit');
  return label.parent as any;
};

describe('Onboarding Form', () => {
  it('does not submit when phone number is invalid', async () => {
    render(<OnboardingScreen />);

    const phoneInput = screen.getByPlaceholderText('555 555 555');

    fireEvent.changeText(phoneInput, '+12025550123');
    fireEvent(phoneInput, 'blur');
    fireEvent(phoneInput, 'endEditing');

    const createProfileContainer = screen.getByText('Submit')
      .parent as any;
    fireEvent.press(createProfileContainer);

    await waitFor(
      () => {
        expect(Alert.alert).not.toHaveBeenCalled();
      },
      {timeout: 500},
    );
  });

  it('prevents submit with corporation number < 9 digits', async () => {
    render(<OnboardingScreen />);
    // fill other fields...
    fireEvent.changeText(screen.getByPlaceholderText('123 456 789'), '123 45');
    fireEvent.press(getCreateProfileContainer());
    await waitFor(() => {
      expect(Alert.alert).not.toHaveBeenCalled();
    });
  });

  it('does not submit when corporation number is invalid', async () => {
    // Mock failed corporation validation
    server.use(
      http.get('*/corporation-number/:number', () => {
        return HttpResponse.json({valid: false});
      }),
    );

    render(<OnboardingScreen />);

    // Fill form with valid-looking but invalid corp number
    fireEvent.changeText(screen.getByPlaceholderText('John'), 'John');
    fireEvent.changeText(screen.getByPlaceholderText('Smith'), 'Smith');
    fireEvent.changeText(
      screen.getByPlaceholderText('555 555 555'),
      '+14165551234',
    );

    fireEvent.changeText(
      screen.getByPlaceholderText('123 456 789'),
      '000000000',
    );

    const createProfileContainer = screen.getByText('Submit')
      .parent as any;
    fireEvent.press(createProfileContainer);

    await waitFor(
      () => {
        expect(Alert.alert).not.toHaveBeenCalled();
      },
      {timeout: 500},
    );
  });

  it('shows success alert on 200 response', async () => {
    // Mock successful validation and profile creation
    server.use(
      http.get('*/corporation-number/:number', () => {
        return HttpResponse.json({valid: true});
      }),
      http.post('*/profile-details', () => {
        return new HttpResponse(null, {status: 200});
      }),
    );

    render(<OnboardingScreen />);

    // Fill valid form data
    fireEvent.changeText(screen.getByPlaceholderText('John'), 'John');
    fireEvent.changeText(screen.getByPlaceholderText('Smith'), 'Smith');
    fireEvent.changeText(
      screen.getByPlaceholderText('555 555 555'),
      '+14165551234',
    );
    fireEvent.changeText(
      screen.getByPlaceholderText('123 456 789'),
      '826417395',
    );

    fireEvent.press(getCreateProfileContainer());

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
    });
  });
});
