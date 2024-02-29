import { Route } from '@solidjs/router';
import type { Component } from 'solid-js';
import { lazy } from 'solid-js';

const Home = lazy(() => import('./component/page/home'));
const NotFound = lazy(() => import('./component/page/not-found'));
const PetCreate = lazy(() => import('./component/page/pet/create'));
const PetList = lazy(() => import('./component/page/pet/list'));
const PetRead = lazy(() => import('./component/page/pet/read'));
const PetUpdate = lazy(() => import('./component/page/pet/update'));

const Routes: Component = () => {
  return (
    <>
      <Route path="/" component={Home} />
      <Route path="/pet" component={PetList} />
      <Route path="/pet/create" component={PetCreate} />
      <Route path="/pet/:id" component={PetRead} />
      <Route path="/pet/:id/update" component={PetUpdate} />
      <Route path="*404" component={NotFound} />
    </>
  );
};

export default Routes;
