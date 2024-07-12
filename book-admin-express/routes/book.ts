import express, { Request, Response } from 'express';
import { Book } from '../model';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    // const body = req.body;
    // console.log(body);
    const bookModel = new Book(req.body);
    const book = await bookModel.save();
    return res.json({ success: true, code: 200 });
});

router.get('/', async (req: Request, res: Response) => {
    const { current = 1, pageSize = 10, name, author, category } = req.query;
    // book.find找到的是所有数据，这块是略过前面页面所有的数据，然后要对当前页开始
    // 后边的所有数据进行一个限制，只返回一个页面的数据
    // 只有搜索栏里有数据的时候，切换页面或者调整页面大小才带着搜索栏里的数据传

    //分页查询
    const data = await Book.find({
        ...(name && { name }),
        ...(author && { author }),
        ...(category && { category }),
    }).skip((Number(current) - 1) * Number(pageSize))
        .limit(Number(pageSize));


    //查询总数    
    const total = await Book.countDocuments({
        ...(name && { name }),
        ...(author && { author }),
        ...(category && { category }),
    });
    return res.status(200).json({ data, total });
});

// 获取书籍详细信息
router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    console.log(book);
    if (book) {
        res.status(200).json({ data: book, success: true });
    } else {
        res.status(500).json({ message: '该书籍不存在' });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        await Book.findOneAndUpdate({ _id: req.params.id}, req.body);
        return res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.delete('/:id', async (req: Request, res: Response) => { 
    const { id } = req.params;
    const book = await Book.findById(id);
    if(book){
        await Book.deleteOne({ _id: id});

        return res.status(200).json({ success: true });
    }else{
        res.status(500).json({ message: '该书籍不存在' });
    }
});

export default router;