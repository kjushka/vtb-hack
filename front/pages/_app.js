import NextNProgress from 'nextjs-progressbar';
import { useRouter } from 'next/router';
import { Provider } from 'react-redux';

import { wrapper } from '@store';
import { NotificationContextProvider } from '@contexts';
import { Menu } from '@components';
import { PersistGate } from 'redux-persist/integration/react';

import '@styles/globals.css';
import '@styles/globals.scss';

function MyApp({ Component, ...rest }) {
  const router = useRouter();

  console.log(router);

  const { store, props } = wrapper.useWrappedStore(rest);

  return (
    <Provider store={store}>
      <PersistGate persistor={store.__persistor} loading={<div>loading</div>}>
        <NotificationContextProvider>
          <NextNProgress />
          <div className='root' data-test='test'>
            <Menu />
            <div className='content'>
              <Component {...props.pageProps} />
            </div>
          </div>
        </NotificationContextProvider>
      </PersistGate>
    </Provider >
  );
}

export default wrapper.withRedux(MyApp);
