import { useDiscoverCommunities } from "@/hooks/community/use-discover-communities";
import { AppHeader } from "../header/app-header";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useState } from "react";
import { useSearchCommunity } from "@/hooks/community/use-search-community";
import { DiscoverCommunityItem } from "../discover/discover-community-item";

export function SearchPage() {
  const [input, setInput] = useState("");
  const { searchCommunities, isLoading } = useSearchCommunity(input);
  const { discoverCommunities } = useDiscoverCommunities();

  return (
    <div className="container overflow-clip">
      <AppHeader />
      <Command className="flex-grow px-4" filter={() => 1}>
        <CommandInput
          placeholder="Search for a community..."
          value={input}
          onValueChange={setInput}
        />
        <CommandList className="h-full">
          <CommandEmpty>
            {isLoading ? "Searching..." : "No results found."}
          </CommandEmpty>
          {input === "" ? (
            <CommandGroup heading="Latest created">
              {discoverCommunities?.map((community) => (
                <CommandItem key={community.address} value={community.address}>
                  <DiscoverCommunityItem community={community} />
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            <CommandGroup heading="Search results">
              {searchCommunities?.map((community) => (
                <CommandItem key={community.address} value={community.address}>
                  <DiscoverCommunityItem community={community} />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  );
}
