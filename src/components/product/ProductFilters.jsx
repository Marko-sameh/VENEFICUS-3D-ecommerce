// 'use client';

// import { ChevronDown, X, Filter, RotateCcw } from 'lucide-react';
// import { useTranslation } from '@/hooks/useTranslation';
// import { useProducts } from '@/hooks/useProducts';
// import { Button } from '@/components/ui/Button';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Badge } from '@/components/ui/badge';
// import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

// const ProductFilters = ({
//     priceRange = { min: 0, max: 1000 },
//     totalProducts = 251,
//     className = ""
// }) => {
//     const { t } = useTranslation();
//     const {
//         filters,
//         filterOptions,
//         filterUI,
//         handleFilterChange,
//         handlePriceRangeSelect,
//         clearAllFilters,
//         getActiveFiltersCount,
//         getCurrentAvailabilityLabel,
//         getCurrentPriceLabel,
//         setFilterUIOpen
//     } = useProducts();

//     return (
//         <div className={className}>
//             <div className="bg-[var(--background)] border-b border-[var(--border-color)] px-4 lg:px-6 py-4">
//                 <div className="flex items-center justify-between">
//                     {/* Left side - Filters */}
//                     <div className="flex items-center gap-4">
//                         <span className="text-sm font-medium text-[var(--text-primary)] hidden sm:block">
//                             {t('filters.filter', 'Filter')}:
//                         </span>

//                         {/* 🌟 Mobile Filter Button */}
//                         <div className="sm:hidden">
//                             <Sheet open={filterUI.isOpen} onOpenChange={setFilterUIOpen}>
//                                 <SheetTrigger asChild>
//                                     <Button
//                                         variant="outline"
//                                         size="sm"
//                                         className="flex items-center justify-center w-full py-2 border-[var(--border-color)]
//                    text-[var(--text-secondary)] bg-[var(--background)] hover:bg-[var(--gray-light)]
//                    rounded-xl shadow-sm transition-all duration-300"
//                                     >
//                                         <Filter className="w-4 h-4 mr-2 text-[var(--main-color)]" />
//                                         <span className="text-sm font-medium">Filter Products</span>
//                                         {getActiveFiltersCount() > 0 && (
//                                             <Badge className="ml-2 bg-[var(--main-color)] text-[var(--text-white)] text-xs px-2 py-0.5 rounded-md">
//                                                 {getActiveFiltersCount()}
//                                             </Badge>
//                                         )}
//                                     </Button>
//                                 </SheetTrigger>

//                                 <SheetContent
//                                     side="left"
//                                     className="w-full sm:w-96 bg-[var(--background)] border-none overflow-y-auto"
//                                 >
//                                     <SheetHeader className="border-b border-[var(--border-color)] pb-3">
//                                         <SheetTitle className="font-heading text-[var(--text-primary)] text-lg">
//                                             Filters
//                                         </SheetTitle>
//                                     </SheetHeader>

//                                     <div className="mt-6 space-y-6 px-2 pb-10">
//                                         {/* 🌿 Availability Section */}
//                                         <div className="space-y-3">
//                                             <h4 className="font-semibold text-[var(--text-primary)] text-base">
//                                                 Availability
//                                             </h4>
//                                             <div className="space-y-3 bg-[var(--gray-light)] p-3 rounded-lg shadow-inner">
//                                                 {filterOptions.availability.map((item) => (
//                                                     <label
//                                                         key={item.value}
//                                                         htmlFor={`mobile-avail-${item.value}`}
//                                                         className="flex items-center justify-between bg-[var(--background)]
//                            p-2 rounded-md hover:bg-[var(--gray-light)] active:scale-[0.98] transition-all"
//                                                     >
//                                                         <div className="flex items-center space-x-2">
//                                                             <Checkbox
//                                                                 id={`mobile-avail-${item.value}`}
//                                                                 checked={filters.availability === item.value}
//                                                                 onCheckedChange={(checked) =>
//                                                                     handleFilterChange("availability", checked ? item.value : "")
//                                                                 }
//                                                             />
//                                                             <span className="text-sm text-[var(--text-secondary)]">
//                                                                 {item.label}
//                                                             </span>
//                                                         </div>
//                                                         <span className="text-xs text-[var(--text-light)]">
//                                                             {item.count}
//                                                         </span>
//                                                     </label>
//                                                 ))}
//                                             </div>
//                                         </div>

//                                         {/* 💰 Price Section */}
//                                         <div className="space-y-3">
//                                             <h4 className="font-semibold text-[var(--text-primary)] text-base">
//                                                 Price
//                                             </h4>
//                                             <div className="space-y-3 bg-[var(--gray-light)] p-3 rounded-lg shadow-inner">
//                                                 {filterOptions.priceRanges.map((range) => (
//                                                     <label
//                                                         key={range.value}
//                                                         htmlFor={`mobile-price-${range.value}`}
//                                                         className="flex items-center bg-[var(--background)]
//                            p-2 rounded-md hover:bg-[var(--gray-light)] active:scale-[0.98] transition-all"
//                                                     >
//                                                         <Checkbox
//                                                             id={`mobile-price-${range.value}`}
//                                                             checked={filters.priceRange === range.value}
//                                                             onCheckedChange={(checked) =>
//                                                                 checked
//                                                                     ? handlePriceRangeSelect(range)
//                                                                     : handleFilterChange("priceRange", "")
//                                                             }
//                                                         />
//                                                         <span className="ml-2 text-sm text-[var(--text-secondary)]">
//                                                             {range.label}
//                                                         </span>
//                                                     </label>
//                                                 ))}
//                                             </div>
//                                         </div>

//                                         {/* 🧹 Clear Filters */}
//                                         {getActiveFiltersCount() > 0 && (
//                                             <Button
//                                                 variant="outline"
//                                                 onClick={() => clearAllFilters(priceRange)}
//                                                 className="w-full border-[var(--main-color)] text-[var(--main-color)]
//                        hover:bg-[var(--main-color)] hover:text-[var(--text-white)]
//                        font-medium mt-6 rounded-xl py-2 transition-all"
//                                             >
//                                                 <RotateCcw className="w-4 h-4 mr-2" />
//                                                 Clear All Filters
//                                             </Button>
//                                         )}
//                                     </div>
//                                 </SheetContent>
//                             </Sheet>
//                         </div>


//                         {/* Desktop Filter Dropdowns */}
//                         <div className="hidden sm:flex items-center gap-2">
//                             {/* Availability Filter */}
//                             <DropdownMenu>
//                                 <DropdownMenuTrigger asChild>
//                                     <Button
//                                         variant="outline"
//                                         size="sm"
//                                         className={`border-[var(--border-color)] hover:bg-[var(--background)] bg-[var(--background)] ${filters.availability ? 'text-[var(--main-color)] border-[var(--main-color)]' : 'text-[var(--text-secondary)]'
//                                             }`}
//                                     >
//                                         {getCurrentAvailabilityLabel()}
//                                         <ChevronDown className="w-4 h-4 ml-1" />
//                                     </Button>
//                                 </DropdownMenuTrigger>
//                                 <DropdownMenuContent align="start" className="w-48 bg-[var(--background)] border-[var(--border-color)]">
//                                     {filterOptions.availability.map((item) => (
//                                         <DropdownMenuItem
//                                             key={item.value}
//                                             onClick={() => handleFilterChange('availability',
//                                                 filters.availability === item.value ? '' : item.value
//                                             )}
//                                             className={`cursor-pointer flex items-center justify-between hover:bg-[var(--gray-light)] ${filters.availability === item.value ? 'bg-[var(--main-color-light)] text-[var(--main-color)]' : ''
//                                                 }`}
//                                         >
//                                             <span>{item.label}</span>
//                                             <span className="text-xs text-[var(--text-light)]">({item.count})</span>
//                                         </DropdownMenuItem>
//                                     ))}
//                                     {filters.availability && (
//                                         <>
//                                             <DropdownMenuSeparator className="bg-[var(--border-color)]" />
//                                             <DropdownMenuItem
//                                                 onClick={() => handleFilterChange('availability', '')}
//                                                 className="cursor-pointer text-[var(--main-color)] hover:bg-[var(--gray-light)]"
//                                             >
//                                                 <X className="w-3 h-3 mr-1" />
//                                                 Clear
//                                             </DropdownMenuItem>
//                                         </>
//                                     )}
//                                 </DropdownMenuContent>
//                             </DropdownMenu>

//                             {/* Price Filter */}
//                             <DropdownMenu>
//                                 <DropdownMenuTrigger asChild>
//                                     <Button
//                                         variant="outline"
//                                         size="sm"
//                                         className={`border-[var(--border-color)] hover:bg-[var(--background)] bg-[var(--background)] transition-colors ${filters.priceRange ? 'text-[var(--main-color)] border-[var(--main-color)]' : 'text-[var(--text-secondary)]'
//                                             }`}
//                                     >
//                                         {getCurrentPriceLabel()}
//                                         <ChevronDown className="w-4 h-4 ml-1" />
//                                     </Button>
//                                 </DropdownMenuTrigger>
//                                 <DropdownMenuContent align="start" className="w-56 bg-[var(--background)] border-[var(--border-color)]">
//                                     {filterOptions.priceRanges.map((range) => (
//                                         <DropdownMenuItem
//                                             key={range.value}
//                                             onClick={() => {
//                                                 if (filters.priceRange === range.value) {
//                                                     handleFilterChange('priceRange', '');
//                                                 } else {
//                                                     handlePriceRangeSelect(range);
//                                                 }
//                                             }}
//                                             className="cursor-pointer hover:bg-[var(--background-hover)] text-[var(--text-secondary)]"
//                                         >
//                                             {range.label}
//                                         </DropdownMenuItem>
//                                     ))}
//                                     {filters.priceRange && (
//                                         <>
//                                             <DropdownMenuSeparator className="bg-[var(--border-color)]" />
//                                             <DropdownMenuItem
//                                                 onClick={() => handleFilterChange('priceRange', '')}
//                                                 className="text-[var(--main-color)] cursor-pointer hover:bg-[var(--background-hover)]"
//                                             >
//                                                 Clear Filter
//                                             </DropdownMenuItem>
//                                         </>
//                                     )}
//                                 </DropdownMenuContent>
//                             </DropdownMenu>

//                             {/* Clear All Filters */}
//                             {getActiveFiltersCount() > 0 && (
//                                 <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     onClick={() => clearAllFilters(priceRange)}
//                                     className="text-[var(--main-color)] hover:bg-[var(--main-color)]/10 ml-2"
//                                 >
//                                     <RotateCcw className="w-4 h-4 mr-1" />
//                                     Clear All
//                                 </Button>
//                             )}
//                         </div>
//                     </div>

//                     {/* Right side - Results count and active filters */}
//                     <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
//                         {/* Sort Dropdown - Mobile & Desktop */}
//                         <div className="flex items-center gap-2 order-2 sm:order-1">
//                             <span className="text-sm font-medium text-[var(--text-primary)] hidden sm:block">
//                                 Sort by:
//                             </span>
//                             <DropdownMenu>
//                                 <DropdownMenuTrigger asChild>
//                                     <Button
//                                         variant="outline"
//                                         size="sm"
//                                         className="border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--background)] bg-[var(--background)] w-full sm:w-auto"
//                                     >
//                                         <span className="sm:hidden mr-2">Sort:</span>
//                                         {filters.sort === 'name-az' ? 'A-Z' :
//                                             filters.sort === 'name-za' ? 'Z-A' :
//                                                 filters.sort === 'price-low' ? 'Price ↑' :
//                                                     filters.sort === 'price-high' ? 'Price ↓' :
//                                                         'A-Z'}
//                                         <span className="hidden sm:inline">
//                                             {filters.sort === 'name-az' ? 'lphabetically, A-Z' :
//                                                 filters.sort === 'name-za' ? 'lphabetically, Z-A' :
//                                                     filters.sort === 'price-low' ? 'rice, low to high' :
//                                                         filters.sort === 'price-high' ? 'rice, high to low' :
//                                                             'lphabetically, A-Z'}
//                                         </span>
//                                         <ChevronDown className="w-4 h-4 ml-1" />
//                                     </Button>
//                                 </DropdownMenuTrigger>
//                                 <DropdownMenuContent align="end" className="w-48 bg-[var(--background)] border-[var(--border-color)]">
//                                     <DropdownMenuItem
//                                         className="cursor-pointer hover:bg-[var(--background-hover)] text-[var(--text-secondary)]"
//                                         onClick={() => handleFilterChange('sort', 'name-az')}
//                                     >
//                                         Alphabetically, A-Z
//                                     </DropdownMenuItem>
//                                     <DropdownMenuItem
//                                         className="cursor-pointer hover:bg-[var(--background-hover)] text-[var(--text-secondary)]"
//                                         onClick={() => handleFilterChange('sort', 'name-za')}
//                                     >
//                                         Alphabetically, Z-A
//                                     </DropdownMenuItem>
//                                     <DropdownMenuItem
//                                         className="cursor-pointer hover:bg-[var(--background-hover)] text-[var(--text-secondary)]"
//                                         onClick={() => handleFilterChange('sort', 'price-low')}
//                                     >
//                                         Price, low to high
//                                     </DropdownMenuItem>
//                                     <DropdownMenuItem
//                                         className="cursor-pointer hover:bg-[var(--background-hover)] text-[var(--text-secondary)]"
//                                         onClick={() => handleFilterChange('sort', 'price-high')}
//                                     >
//                                         Price, high to low
//                                     </DropdownMenuItem>
//                                 </DropdownMenuContent>
//                             </DropdownMenu>
//                         </div>

//                         {/* Results Count */}
//                         <span className="text-sm text-[var(--text-secondary)] whitespace-nowrap order-1 sm:order-2">
//                             {totalProducts} {totalProducts === 1 ? 'product' : 'products'}
//                         </span>
//                     </div>
//                 </div>

//                 {/* Active Filters Row - Mobile Only */}
//                 {getActiveFiltersCount() > 0 && (
//                     <div className="flex sm:hidden items-center gap-2 mt-3 pt-3 border-t border-[var(--border-color)]">
//                         <span className="text-xs text-[var(--text-secondary)] font-medium">
//                             Active:
//                         </span>
//                         <div className="flex flex-wrap gap-1">
//                             {filters.availability && (
//                                 <Badge
//                                     variant="outline"
//                                     className="text-xs border-[var(--main-color)] text-[var(--main-color)] bg-[var(--main-color)]/5 cursor-pointer"
//                                     onClick={() => handleFilterChange('availability', '')}
//                                 >
//                                     {getCurrentAvailabilityLabel()}
//                                     <X className="w-3 h-3 ml-1" />
//                                 </Badge>
//                             )}
//                             {filters.priceRange && (
//                                 <Badge
//                                     variant="outline"
//                                     className="text-xs border-[var(--main-color)] text-[var(--main-color)] bg-[var(--main-color)]/5 cursor-pointer"
//                                     onClick={() => handleFilterChange('priceRange', '')}
//                                 >
//                                     {getCurrentPriceLabel()}
//                                     <X className="w-3 h-3 ml-1" />
//                                 </Badge>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ProductFilters;




'use client';

import { ChevronDown, X, Filter, RotateCcw } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

const ProductFilters = ({
    priceRange = { min: 0, max: 1000 },
    totalProducts = 251,
    className = ""
}) => {
    const { t } = useTranslation();
    const {
        filters,
        filterOptions,
        filterUI,
        handleFilterChange,
        handlePriceRangeSelect,
        clearAllFilters,
        getActiveFiltersCount,
        getCurrentAvailabilityLabel,
        getCurrentPriceLabel,
        setFilterUIOpen
    } = useProducts();

    return (
        <div className={`${className} w-full`}>
            <div className="bg-[var(--background)] border-b border-[var(--border-color)] px-3 sm:px-6 py-3 sm:py-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">

                    {/* Left side - Filters */}
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        <span className="text-sm font-medium text-[var(--text-primary)] hidden sm:block">
                            {t('filters.filter', 'Filter')}:
                        </span>

                        {/* 🌟 Mobile Filter Button */}
                        <div className="sm:hidden w-full">
                            <Sheet open={filterUI.isOpen} onOpenChange={setFilterUIOpen}>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center justify-center w-full py-2.5 border-[var(--border-color)]
                   text-[var(--text-secondary)] bg-[var(--background)] hover:bg-[var(--gray-light)]
                   rounded-xl shadow-sm transition-all duration-300"
                                    >
                                        <Filter className="w-4 h-4 mr-2 text-[var(--main-color)]" />
                                        <span className="text-sm font-medium">Filter Products</span>
                                        {getActiveFiltersCount() > 0 && (
                                            <Badge className="ml-2 bg-[var(--main-color)] text-[var(--text-white)] text-xs px-2 py-0.5 rounded-md">
                                                {getActiveFiltersCount()}
                                            </Badge>
                                        )}
                                    </Button>
                                </SheetTrigger>

                                <SheetContent
                                    side="left"
                                    className="w-full sm:w-96 bg-[var(--background)] border-none overflow-y-auto p-4"
                                >
                                    <SheetHeader className="border-b border-[var(--border-color)] pb-3">
                                        <SheetTitle className="font-heading text-[var(--text-primary)] text-lg text-center">
                                            Filters
                                        </SheetTitle>
                                    </SheetHeader>

                                    <div className="mt-6 space-y-6 pb-10">
                                        {/* 🌿 Availability Section */}
                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-[var(--text-primary)] text-base">
                                                Availability
                                            </h4>
                                            <div className="space-y-2 bg-[var(--gray-light)] p-3 rounded-lg shadow-inner">
                                                {filterOptions.availability.map((item) => (
                                                    <label
                                                        key={item.value}
                                                        htmlFor={`mobile-avail-${item.value}`}
                                                        className="flex items-center justify-between bg-[var(--background)]
                           p-2 rounded-md hover:bg-[var(--gray-light)] active:scale-[0.98] transition-all"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`mobile-avail-${item.value}`}
                                                                checked={filters.availability === item.value}
                                                                onCheckedChange={(checked) =>
                                                                    handleFilterChange("availability", checked ? item.value : "")
                                                                }
                                                            />
                                                            <span className="text-sm text-[var(--text-secondary)]">
                                                                {item.label}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-[var(--text-light)]">
                                                            {item.count}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 💰 Price Section */}
                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-[var(--text-primary)] text-base">
                                                Price
                                            </h4>
                                            <div className="space-y-2 bg-[var(--gray-light)] p-3 rounded-lg shadow-inner">
                                                {filterOptions.priceRanges.map((range) => (
                                                    <label
                                                        key={range.value}
                                                        htmlFor={`mobile-price-${range.value}`}
                                                        className="flex items-center bg-[var(--background)]
                           p-2 rounded-md hover:bg-[var(--gray-light)] active:scale-[0.98] transition-all"
                                                    >
                                                        <Checkbox
                                                            id={`mobile-price-${range.value}`}
                                                            checked={filters.priceRange === range.value}
                                                            onCheckedChange={(checked) =>
                                                                checked
                                                                    ? handlePriceRangeSelect(range)
                                                                    : handleFilterChange("priceRange", "")
                                                            }
                                                        />
                                                        <span className="ml-2 text-sm text-[var(--text-secondary)]">
                                                            {range.label}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 🧹 Clear Filters */}
                                        {getActiveFiltersCount() > 0 && (
                                            <Button
                                                variant="outline"
                                                onClick={() => clearAllFilters(priceRange)}
                                                className="w-full border-[var(--main-color)] text-[var(--main-color)]
                       hover:bg-[var(--main-color)] hover:text-[var(--text-white)]
                       font-medium mt-6 rounded-xl py-2 transition-all"
                                            >
                                                <RotateCcw className="w-4 h-4 mr-2" />
                                                Clear All Filters
                                            </Button>
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Desktop Filter Dropdowns */}
                        <div className="hidden sm:flex items-center gap-2 flex-wrap">
                            {/* Availability Filter */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className={`border-[var(--border-color)] hover:bg-[var(--gray-light)] hover:text-[var(--main-color)] bg-[var(--background)] ${filters.availability ? 'text-[var(--main-color)] border-[var(--main-color)]' : 'text-[var(--text-secondary)]'}`}
                                    >
                                        {getCurrentAvailabilityLabel()}
                                        <ChevronDown className="w-4 h-4 ml-1" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-48 bg-[var(--background)] border-[var(--border-color)]">
                                    {filterOptions.availability.map((item) => (
                                        <DropdownMenuItem
                                            key={item.value}
                                            onClick={() => handleFilterChange('availability', filters.availability === item.value ? '' : item.value)}
                                            className={`cursor-pointer flex items-center hover:text-[var(--main-color)] justify-between hover:bg-[var(--gray-light)] ${filters.availability === item.value ? 'bg-[var(--main-color-light)] text-[var(--main-color)]' : ''}`}
                                        >
                                            <span>{item.label}</span>
                                            <span className="text-xs text-[var(--text-light)]">({item.count})</span>
                                        </DropdownMenuItem>
                                    ))}
                                    {filters.availability && (
                                        <>
                                            <DropdownMenuSeparator className="bg-[var(--border-color)]" />
                                            <DropdownMenuItem
                                                onClick={() => handleFilterChange('availability', '')}
                                                className="cursor-pointer text-[var(--main-color)] hover:bg-[var(--gray-light)] hover:text-[var(--main-color)]"
                                            >
                                                <X className="w-3 h-3 mr-1" />
                                                Clear
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Price Filter */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className={`border-[var(--border-color)] hover:text-[var(--main-color)] hover:bg-[var(--gray-light)] bg-[var(--background)] ${filters.priceRange ? 'text-[var(--main-color)] border-[var(--main-color)]' : 'text-[var(--text-secondary)]'}`}
                                    >
                                        {getCurrentPriceLabel()}
                                        <ChevronDown className="w-4 h-4 ml-1" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-56 bg-[var(--background)] border-[var(--border-color)]">
                                    {filterOptions.priceRanges.map((range) => (
                                        <DropdownMenuItem
                                            key={range.value}
                                            onClick={() => {
                                                if (filters.priceRange === range.value) {
                                                    handleFilterChange('priceRange', '');
                                                } else {
                                                    handlePriceRangeSelect(range);
                                                }
                                            }}
                                            className="cursor-pointer hover:bg-[var(--gray-light)] hover:text-[var(--main-color)] text-[var(--text-secondary)]"
                                        >
                                            {range.label}
                                        </DropdownMenuItem>
                                    ))}
                                    {filters.priceRange && (
                                        <>
                                            <DropdownMenuSeparator className="bg-[var(--border-color)]" />
                                            <DropdownMenuItem
                                                onClick={() => handleFilterChange('priceRange', '')}
                                                className="text-[var(--main-color)] cursor-pointer hover:bg-[var(--gray-light)] hover:text-[var(--main-color)]"
                                            >
                                                Clear Filter
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Clear All Filters */}
                            {getActiveFiltersCount() > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => clearAllFilters(priceRange)}
                                    className="text-[var(--main-color)] hover:bg-[var(--main-color)]/10 ml-2"
                                >
                                    <RotateCcw className="w-4 h-4 mr-1" />
                                    Clear All
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Right side - Results count and sorting */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full sm:w-auto gap-2 sm:gap-4">
                        {/* Sort Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-[var(--border-color)] text-[var(--text-secondary)] bg-[var(--background)] hover:bg-[var(--gray-light)] hover:text-[var(--main-color)] w-full sm:w-auto"
                                >
                                    <span className="sm:hidden mr-2">Sort:</span>
                                    {filters.sort === 'name-az' ? 'A-Z'
                                        : filters.sort === 'name-za' ? 'Z-A'
                                            : filters.sort === 'price-low' ? 'Price ↑'
                                                : filters.sort === 'price-high' ? 'Price ↓'
                                                    : 'A-Z'}
                                    <ChevronDown className="w-4 h-4 ml-1" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-[var(--background)] border-[var(--border-color)]">
                                <DropdownMenuItem onClick={() => handleFilterChange('sort', 'name-az')} className="hover:text-[var(--main-color)] hover:bg-[var(--gray-light)]">
                                    Alphabetically, A-Z
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleFilterChange('sort', 'name-za')} className="hover:text-[var(--main-color)] hover:bg-[var(--gray-light)]">
                                    Alphabetically, Z-A
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleFilterChange('sort', 'price-low')} className="hover:text-[var(--main-color)] hover:bg-[var(--gray-light)]">
                                    Price, low to high
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleFilterChange('sort', 'price-high')} className="hover:text-[var(--main-color)] hover:bg-[var(--gray-light)]">
                                    Price, high to low
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Results Count */}
                        <span className="text-sm text-[var(--text-secondary)] whitespace-nowrap">
                            {totalProducts} {totalProducts === 1 ? 'product' : 'products'}
                        </span>
                    </div>
                </div>

                {/* Active Filters Row - Mobile Only */}
                {getActiveFiltersCount() > 0 && (
                    <div className="flex sm:hidden items-center flex-wrap gap-2 mt-3 pt-3 border-t border-[var(--border-color)]">
                        <span className="text-xs text-[var(--text-secondary)] font-medium">
                            Active:
                        </span>
                        <div className="flex flex-wrap gap-1">
                            {filters.availability && (
                                <Badge
                                    variant="outline"
                                    className="text-xs border-[var(--main-color)] text-[var(--main-color)] bg-[var(--main-color)]/5 cursor-pointer hover:text-[var(--main-color)]"
                                    onClick={() => handleFilterChange('availability', '')}
                                >
                                    {getCurrentAvailabilityLabel()}
                                    <X className="w-3 h-3 ml-1" />
                                </Badge>
                            )}
                            {filters.priceRange && (
                                <Badge
                                    variant="outline"
                                    className="text-xs border-[var(--main-color)] text-[var(--main-color)] bg-[var(--main-color)]/5 cursor-pointer hover:text-[var(--main-color)]"
                                    onClick={() => handleFilterChange('priceRange', '')}
                                >
                                    {getCurrentPriceLabel()}
                                    <X className="w-3 h-3 ml-1" />
                                </Badge>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductFilters;
