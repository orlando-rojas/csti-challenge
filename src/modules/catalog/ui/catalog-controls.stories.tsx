import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { CatalogPendingProvider } from "@/modules/catalog/ui/catalog-pending";
import { SearchInput } from "@/modules/catalog/ui/search-input";
import { SortSelect } from "@/modules/catalog/ui/sort-select";

type ControlArgs = {
  placeholder: string;
  stacked: boolean;
};

function Controls({ placeholder, stacked }: ControlArgs) {
  return (
    <NuqsAdapter>
      <CatalogPendingProvider>
        <div
          className={
            stacked
              ? "flex w-full min-w-0 max-w-xs flex-col gap-3"
              : "flex w-full min-w-0 flex-col gap-3 sm:flex-row"
          }
        >
          <SearchInput placeholder={placeholder} />
          <SortSelect />
        </div>
      </CatalogPendingProvider>
    </NuqsAdapter>
  );
}

const meta = {
  title: "Catalog/Controls",
  component: Controls,
  tags: ["autodocs"],
  args: {
    placeholder: "Buscar productos",
    stacked: false,
  },
  argTypes: {
    placeholder: { control: "text" },
    stacked: { control: "boolean" },
  },
  parameters: { frame: "panel" },
} satisfies Meta<typeof Controls>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SearchAndSort: Story = {};

export const Narrow: Story = {
  args: { stacked: true },
};
