import type { Component } from 'solid-js';
import { PawIcon } from '../../../src/component/icon';
import { ModelCard } from '../../../src/component/partial/model-card';

const countLabel = (count: number) => (count === 1 ? 'pet' : 'pets');

export const ModelCardStory: Component = () => (
  <div class="grid w-[880px] grid-cols-3 gap-4">
    <ModelCard
      icon={<PawIcon size={20} />}
      title="Pets"
      description="With count and create."
      count={12}
      countLabel={countLabel}
      listHref="/pet"
      createHref="/pet/create"
      createLabel="New pet"
    />
    <ModelCard
      icon={<PawIcon size={20} />}
      title="Pets"
      description="Single, no create."
      count={1}
      countLabel={countLabel}
      listHref="/pet"
      createLabel="New pet"
    />
    <ModelCard
      icon={<PawIcon size={20} />}
      title="Pets"
      description="Count not loaded."
      countLabel={countLabel}
      listHref="/pet"
      createLabel="New pet"
    />
  </div>
);
