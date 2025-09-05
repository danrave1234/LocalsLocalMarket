package org.localslocalmarket.web.dto;

import org.springframework.data.domain.Page;

/**
 * DTOs for pagination responses
 */
public class PaginationDtos {
    
    /**
     * Comprehensive pagination response wrapper
     */
    public record PaginatedResponse<T>(
        java.util.List<T> content,
        PaginationMetadata pagination
    ) {
        public static <T> PaginatedResponse<T> of(Page<T> page) {
            return new PaginatedResponse<>(
                page.getContent(),
                new PaginationMetadata(
                    page.getNumber(),
                    page.getSize(),
                    page.getTotalElements(),
                    page.getTotalPages(),
                    page.isFirst(),
                    page.isLast(),
                    page.hasNext(),
                    page.hasPrevious(),
                    page.getNumberOfElements()
                )
            );
        }
    }
    
    /**
     * Pagination metadata
     */
    public record PaginationMetadata(
        int currentPage,           // 0-based page number
        int pageSize,             // Number of items per page
        long totalElements,       // Total number of elements across all pages
        int totalPages,           // Total number of pages
        boolean isFirst,          // Is this the first page
        boolean isLast,           // Is this the last page
        boolean hasNext,          // Is there a next page
        boolean hasPrevious,      // Is there a previous page
        int numberOfElements      // Number of elements in current page
    ) {
        /**
         * Get 1-based page number for display
         */
        public int getDisplayPage() {
            return currentPage + 1;
        }
        
        /**
         * Get start index of current page (1-based)
         */
        public long getStartIndex() {
            return (long) currentPage * pageSize + 1;
        }
        
        /**
         * Get end index of current page (1-based)
         */
        public long getEndIndex() {
            return Math.min(getStartIndex() + numberOfElements - 1, totalElements);
        }
        
        /**
         * Get page range for pagination UI (e.g., [1, 2, 3, 4, 5])
         */
        public java.util.List<Integer> getPageRange(int maxPages) {
            int start = Math.max(0, currentPage - maxPages / 2);
            int end = Math.min(totalPages - 1, start + maxPages - 1);
            start = Math.max(0, end - maxPages + 1);
            
            java.util.List<Integer> pages = new java.util.ArrayList<>();
            for (int i = start; i <= end; i++) {
                pages.add(i + 1); // Convert to 1-based
            }
            return pages;
        }
    }
}
