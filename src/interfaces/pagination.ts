export default interface Pagination {
    total: number
    total_page: number
    per_page: number
    prev_page: number
    next_page: number
    current_page: number
    from: number
    to: number
}