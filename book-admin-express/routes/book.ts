import express, { Request, Response } from 'express';
import { Book } from '../model';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const { current = 1, pageSize = 10, name, author, category } = req.query;
    // book.find找到的是所有数据，这块是略过前面页面所有的数据，然后要对当前页开始
    // 后边的所有数据进行一个限制，只返回一个页面的数据
    // 只有搜索栏里有数据的时候，切换页面或者调整页面大小才带着搜索栏里的数据传
    const data = await Book.find({
        ...(name && { name }),
        ...(author && { author }),
        ...(category && { category }),
    }).skip((Number(current) - 1) * Number(pageSize))
        .limit(Number(pageSize));

    const total = await Book.countDocuments({
        ...(name && { name }),
        ...(author && { author }),
        ...(category && { category }),
    });
    return res.status(200).json({ data, total });
});

router.post('/', (req: Request, res: Response) => {
    const body = req.body;
    // console.log(body);
    const bookModel = new Book({ ...body });
    bookModel.save();
    return res.json({ success: true, code: 200 });
});

export default router;