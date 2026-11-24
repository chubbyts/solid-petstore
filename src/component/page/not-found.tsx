import type { Component } from 'solid-js';
import { PageHeader } from '../heading';
import { BackToList } from '../partial/back-to-list';
import { useDocumentTitle } from '../../hook/use-document-title';

const pageTitle = 'Not Found';

const NotFound: Component = () => {
  useDocumentTitle(() => pageTitle);

  return (
    <div data-testid="page-not-found" class="flex flex-col gap-[22px]">
      <PageHeader eyebrow="404" title={pageTitle} action={<BackToList href="/pet" />} />
      <p class="text-fg-muted m-0">There is no page at this address.</p>
    </div>
  );
};

export default NotFound;
