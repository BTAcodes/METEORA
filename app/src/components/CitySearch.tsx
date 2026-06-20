import { useState } from "react";
import { Button } from "./ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { Clock, Loader2, Search, Star, XCircle } from "lucide-react";
import { useLocationSearch } from "@/hooks/use-weather";
import { useNavigate } from "react-router-dom";
import { useSerchHistory } from "@/hooks/use-search-history";
import { format } from "date-fns";
import { useFavorite } from "@/hooks/use-favorite";

const CitySearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { data: loctaions, isLoading } = useLocationSearch(query);
  const { history, clearHistory, addToHistory } = useSerchHistory();

  const handleSelect = (cityDate: string) => {
    const [lat, lon, name, country] = cityDate.split("|");

    // add to search history
    addToHistory.mutate({
      query,
      name,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country,
    });
    setOpen(false);
    setQuery("");
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };
  const { favorites } = useFavorite()
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="relative w-24 h-10 px-2 justify-center text-sm text-muted-foreground sm:w-40 sm:h-10 sm:p-4 sm:justify-start lg:w-64"
      >
        <Search className="mr-1 sm:mr-2 w-4 h-4 shrink-0" />
        <span className="inline sm:hidden">Search</span>
        <span className="hidden sm:inline">Search city</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput
            placeholder="Search city"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {query.length > 2 && !isLoading && (
              <CommandEmpty>No Cities found</CommandEmpty>
            )}
            {/* favorites */}
            {favorites.length > 0 && (
                <CommandGroup heading="Favorites">
                  {favorites.map((fav) => {
                    return (
                      <CommandItem
                        key={fav.id}
                        value={`${fav.lat}| ${fav.lon}|${fav.name}|${fav.country}`}
                        onSelect={handleSelect}
                      >
                        <Star className=" mr-2 h-4 w-4 text-yellow-500" />
                        <span>{fav.name}</span>
                        {fav.state && (
                          <span className=" text-sm text-muted-foreground">
                            , {fav.state}
                          </span>
                        )}
                        <span className=" text-sm text-muted-foreground">
                          , {fav.country}
                        </span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
            )}

            {/* history */}
            {history.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <div className=" flex items-center justify-between px-2 my-2">
                    <p className=" text-xs text-muted-foreground">
                      {" "}
                      Recent Searches
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        clearHistory.mutate();
                        setOpen(false);
                      }}
                    >
                      <XCircle className=" h-4 w-4" />
                      Clear
                    </Button>
                  </div>
                  {history.map((loc) => {
                    return (
                      <CommandItem
                        key={`${loc.lat}-${loc.lon}`}
                        value={`${loc.lat}| ${loc.lon}|${loc.name}|${loc.country}`}
                        onSelect={handleSelect}
                      >
                        <Clock className=" mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{loc.name}</span>
                        {loc.state && (
                          <span className=" text-sm text-muted-foreground">
                            , {loc.state}
                          </span>
                        )}
                        <span className=" text-sm text-muted-foreground">
                          , {loc.country}
                        </span>
                        <span className=" ml-auto text-xs text-muted-foreground">
                          {format(loc.searchedAT, "MMM d, h:mm a")}
                        </span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </>
            )}
            <CommandSeparator />
            {/* search Suggestions */}
            {loctaions && loctaions.length > 0 && (
              <CommandGroup heading="Suggestions">
                {isLoading && (
                  <div className=" flex items-center justify-center p-4">
                    <Loader2 className=" h-4 w-4 animate-spin" />
                  </div>
                )}
                {loctaions.map((loc) => {
                  return (
                    <CommandItem
                      key={`${loc.lat}-${loc.lon}`}
                      value={`${loc.lat}| ${loc.lon}|${loc.name}|${loc.country}`}
                      onSelect={handleSelect}
                    >
                      <Search className=" mr-2 h-4 w-4" />
                      <span>{loc.name}</span>
                      {loc.state && (
                        <span className=" text-sm text-muted-foreground">
                          , {loc.state}
                        </span>
                      )}
                      <span className=" text-sm text-muted-foreground">
                        , {loc.country}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
};

export default CitySearch;
