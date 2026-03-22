// server/models/textbookModel.js
const db = require('../config/db');

class TextbookModel {
    static async findAll() {
        // 连表查询校区名称
        return await db('textbooks as t')
            .leftJoin('campuses as c', 't.campus_id', 'c.id')
            .select('t.*', 'c.name as campus_name')
            .orderBy('t.id', 'desc');
    }

    static async create(data) {
        const { book_name, stock, unit_price, campus_id, distribution_records } = data;
        const [insertId] = await db('textbooks').insert({
            book_name,
            stock,
            unit_price,
            campus_id,
            distribution_records: JSON.stringify(distribution_records)
        });
        return insertId;
    }

    static async update(id, data) {
        const { book_name, unit_price } = data;
        const affectedRows = await db('textbooks')
            .where({ id })
            .update({
                book_name,
                unit_price
            });
        return affectedRows;
    }

    static async remove(id) {
        const affectedRows = await db('textbooks').where({ id }).del();
        return affectedRows;
    }
}

module.exports = TextbookModel;