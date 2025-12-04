import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Search, X } from 'lucide-react';

export interface CelebrityFilter {
    searchQuery: string;
    popularityRange: [number, number];
    niches: string[];
    status: 'all' | 'active' | 'inactive';
    dateRange: {
        from: Date | undefined;
        to: Date | undefined;
    };
    minRating: number;
    minFollowers: number;
}

interface CelebrityFiltersProps {
    filters: CelebrityFilter;
    onFilterChange: (filters: Partial<CelebrityFilter>) => void;
    availableNiches: string[];
}

export default function CelebrityFilters({ filters, onFilterChange, availableNiches }: CelebrityFiltersProps) {
    console.log('Available niches:', availableNiches); // Используем переменную

    const handleFilterChange = (newFilters: Partial<CelebrityFilter>) => {
        onFilterChange(newFilters);
    };

    const resetFilters = () => {
        onFilterChange({
            searchQuery: '',
            popularityRange: [0, 100],
            niches: [],
            status: 'all',
            dateRange: { from: undefined, to: undefined },
            minRating: 0,
            minFollowers: 0,
        });
    };

    const hasActiveFilters = filters.searchQuery ||
        filters.niches.length > 0 ||
        filters.status !== 'all' ||
        filters.minRating > 0 ||
        filters.minFollowers > 0;

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange({ searchQuery: e.target.value })}
                    placeholder="Search celebrities..."
                    className="pl-10"
                />
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap gap-2 items-center">
                    <span className="text-sm text-muted-foreground">Active filters:</span>

                    {filters.searchQuery && (
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm">
                            Search: {filters.searchQuery}
                            <button
                                onClick={() => handleFilterChange({ searchQuery: '' })}
                                className="ml-1 rounded-full bg-gray-200 p-0.5 hover:bg-gray-300"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    )}

                    <Button
                        onClick={resetFilters}
                        variant="link"
                        size="sm"
                    >
                        Сбросить все
                    </Button>
                </div>
            )}
        </div>
    );
}
