const pagination = (page: any, limit: number, total: number) => {
    const totalPage = Math.ceil(total / limit) < 1 ? 1 : Math.ceil(total / limit);
    const nextPage = page + 1 > totalPage ? totalPage : page + 1;
    const prevPage = page - 1 < 1 ? 1 : page - 1;

    return {
        total: total,
        total_page : totalPage,
        per_page: limit,
        prev_page: prevPage,
        next_page: nextPage,
        current_page: parseInt(page),
        from: (page - 1) * limit + 1,
        to: page * limit > total ? total : page * limit,
    }
}

export default pagination;