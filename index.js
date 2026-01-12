/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import OnboardingScreen from './src/screens/OnboardingScreen';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => OnboardingScreen);
