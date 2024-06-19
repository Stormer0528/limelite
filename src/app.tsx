import 'src/global.css';

// ----------------------------------------------------------------------

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { AuthProvider } from 'src/auth';
import { ThemeProvider } from 'src/theme/theme-provider';

import { SnackBar } from 'src/components/SnackBar';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import ApolloProvider from './ApolloProvider';
import { DayjsProvider } from './DayjsProvider';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ApolloProvider>
      <DayjsProvider>
        <AuthProvider>
          <SettingsProvider settings={defaultSettings}>
            <ThemeProvider>
              <MotionLazy>
                <SnackBar />
                <ProgressBar />
                <SettingsDrawer />
                <Router />
              </MotionLazy>
            </ThemeProvider>
          </SettingsProvider>
        </AuthProvider>
      </DayjsProvider>
    </ApolloProvider>
  );
}
