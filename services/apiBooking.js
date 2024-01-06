
const supabase = require('../utils/supabase');
const {PAGE_SIZE} = require('../utils/constants')

exports.getBooingsRowCount = async function ({filter}) {
    let queryCount = supabase.from('bookings').select('id', {
        count: 'exact',
        head: true
    });

    if (filter) {
        queryCount = queryCount[filter.method || 'eq'](filter.field, filter.value)
    }

    const { error, count: countRows } = await queryCount;

    if (error) {
        console.error(error);
    }

    return { data: {countRows}, error }
}

exports.getBookings = async function ({filter, sortBy, page}) {
    let query = supabase.from('bookings').select('*, rooms(name, id), quests(fullName, email, nationalID, id)', {
        count: 'exact'
    })

    // FILTER
    if (filter) {
        query = query[filter.method || 'eq'](filter.field, filter.value)
    }

    // SORT
    if (sortBy && sortBy.field) {
        query = query.order(sortBy.field, {
            ascending: sortBy.direction === 'asc'
        })
    }

    // PAGINATION
    if (page) {
        const from = (page - 1) * PAGE_SIZE;
        const to = page* PAGE_SIZE - 1;
    }
}