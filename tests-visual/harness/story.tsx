import { render } from 'solid-js/web';
import { Dynamic } from 'solid-js/web';
import { Show } from 'solid-js';
import { MemoryRouter, Route } from '@solidjs/router';
import { PageErrorProvider } from '../../src/hook/use-page-error';
import { ToastProvider } from '../../src/hook/use-toast';
import { stories } from '../stories';
import '../../src/index.css';

// story.html?story=button, the theme follows the color scheme of the browser (like the app without a stored choice)
const storyName = new URLSearchParams(window.location.search).get('story') ?? '';

document.documentElement.setAttribute(
  'data-theme',
  window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark',
);

const Story = stories[storyName];

render(
  () => (
    <ToastProvider>
      <PageErrorProvider>
        {/* the links of the components need a router */}
        <MemoryRouter>
          <Route
            path="*"
            component={() => (
              <div data-testid="story" class="bg-canvas inline-block p-4">
                <Show when={Story} fallback={<p>Unknown story: {storyName}</p>}>
                  {(getStory) => <Dynamic component={getStory()} />}
                </Show>
              </div>
            )}
          />
        </MemoryRouter>
      </PageErrorProvider>
    </ToastProvider>
  ),
  document.getElementById('root') as HTMLElement,
);
