import type { Component } from 'solid-js';
import { Pagination } from '../../../src/component/partial/pagination';

const pageHref = (page: number) => `/pet?page=${page}`;

export const PaginationStory: Component = () => (
  <div class="flex w-[720px] flex-col gap-4">
    <Pagination getOffset={() => 0} getLimit={() => 10} getCount={() => 0} pageHref={pageHref} />
    {/* a single page: no page links */}
    <Pagination getOffset={() => 0} getLimit={() => 10} getCount={() => 5} pageHref={pageHref} />
    <Pagination getOffset={() => 0} getLimit={() => 10} getCount={() => 120} pageHref={pageHref} />
    <Pagination getOffset={() => 50} getLimit={() => 10} getCount={() => 120} pageHref={pageHref} />
    <Pagination getOffset={() => 110} getLimit={() => 10} getCount={() => 120} pageHref={pageHref} />
  </div>
);
