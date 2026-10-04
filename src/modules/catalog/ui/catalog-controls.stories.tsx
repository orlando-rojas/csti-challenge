import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { CatalogPendingProvider } from "@/modules/catalog/ui/catalog-pending";
import { SearchInput } from "@/modules/catalog/ui/search-input";
import { SortSelect } from "@/modules/catalog/ui/sort-select";

function Controls() {
  return (
    <NuqsAdapter>
      <CatalogPendingProvider>
        <div className="flex max-w-xl flex-col gap-3 sm:flex-row">
          <SearchInput />
          <SortSelect />
        </div>
      </CatalogPendingProvider>
    </NuqsAdapter>
  );
}

const meta = {
  title: "Catalog/Controls",
  component: Controls,
} satisfies Meta<typeof Controls>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SearchAndSort: Story = {};
