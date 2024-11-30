import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxDisplayedPages = 5; // Maximum number of pages to display in the pagination
        const half = Math.floor(maxDisplayedPages / 2);

        let startPage = Math.max(1, currentPage - half);
        let endPage = Math.min(totalPages, currentPage + half);

        if (currentPage - half < 1) {
            endPage = Math.min(totalPages, endPage + (half - currentPage + 1));
        } else if (currentPage + half > totalPages) {
            startPage = Math.max(1, startPage - (currentPage + half - totalPages));
        }

        for (let page = startPage; page <= endPage; page++) {
            pages.push(page);
        }
        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className="pagination">
            {currentPage > 1 && (
                <button onClick={() => onPageChange(currentPage - 1)}>Previous</button>
            )}
            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    disabled={page === currentPage}
                >
                    {page}
                </button>
            ))}
            {currentPage < totalPages && (
                <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
            )}
        </div>
    );
};

export default Pagination