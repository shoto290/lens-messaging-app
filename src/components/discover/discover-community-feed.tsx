import { DiscoverCommunityItem } from "./discover-community-item";
import { useDiscoverCommunities } from "@/hooks/community/use-discover-communities";
import { DiscoverCommunitySquareItem } from "./discover-community-square-item";
import { Carousel, CarouselItem, CarouselContent } from "../ui/carousel";

export function DiscoverCommunityFeed() {
  const { discoverCommunities } = useDiscoverCommunities();

  return (
    <div className="flex flex-col gap-2">
      <Carousel>
        <CarouselContent className="px-5">
          {discoverCommunities
            .filter((c) => c.metadata?.icon)
            .slice(0, 5)
            .map((community) => (
              <CarouselItem className="basis-auto" key={community.address}>
                <DiscoverCommunitySquareItem community={community} />
              </CarouselItem>
            ))}
        </CarouselContent>
      </Carousel>
      <p className="text-sm font-medium font-mono px-4 pl-6 pt-6">
        Lastest created
      </p>
      <div className="flex flex-col gap-2 px-4">
        {discoverCommunities?.map((community) => (
          <DiscoverCommunityItem
            key={community.address}
            community={community}
          />
        ))}
      </div>
    </div>
  );
}
