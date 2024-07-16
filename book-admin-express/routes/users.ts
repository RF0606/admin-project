import express, { Request, Response } from 'express';
import { User } from '../model';

const router = express.Router();

//创建user
router.post('/', async (req: Request, res: Response) => {
    const { name } = req.body;
    const userModel = new User(req.body);
    const oldUser = await User.findOne({ name });
    if (!oldUser) {
        await userModel.save();
        return res.status(200).json({ success: true });
    } else {
        return res.status(500).json({ message: "用户已存在" });
    }
    // return res.json({ success: true, code: 200 });
});


//获取所有user信息
router.get('/', async (req: Request, res: Response) => {
    const { current = 1, pageSize = 10, name, status } = req.query;
    // User.find找到的是所有数据，这块是略过前面页面所有的数据，然后要对当前页开始
    // 后边的所有数据进行一个限制，只返回一个页面的数据
    // 只有搜索栏里有数据的时候，切换页面或者调整页面大小才带着搜索栏里的数据传

    //分页查询
    const data = await User.find({
        ...(name && { name }),
        ...(status && { status }),
    })
        .sort({ updatedAt: -1 })
        .skip((Number(current) - 1) * Number(pageSize))
        .limit(Number(pageSize));


    //查询总数    
    const total = await User.countDocuments({
        ...(name && { name }),
        ...(status && { status }),
    });
    return res.status(200).json({ data, total });
});

// 获取用户详细信息
router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await User.findById(id);
    console.log(user);
    if (user) {
        res.status(200).json({ data: user, success: true });
    } else {
        res.status(500).json({ message: '该用户不存在' });
    }
});

//更新
router.put('/:id', async (req: Request, res: Response) => {
    try {
        await User.findOneAndUpdate({ _id: req.params.id }, req.body);
        return res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error });
    }
});

//删除
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user) {
        await User.deleteOne({ _id: id });

        return res.status(200).json({ success: true });
    } else {
        res.status(500).json({ message: '该用户不存在' });
    }
});

export default router;