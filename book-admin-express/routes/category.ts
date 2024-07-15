import express, { Request, Response, NextFunction } from "express";
import { Category,Book} from "../model";

var router = express.Router();

//创建新的 
router.post("/", async (req: Request, res: Response) => {
  const { name } = req.body;
  const category = new Category(req.body);

  const oldCategory = await Category.findOne({ name });

  if (!oldCategory) {
    await category.save();
    return res.status(200).json({ success: true });
  } else {
    return res.status(500).json({ message: "分类已存在" });
  }
});

//获取列表
router.get("/", async (req: Request, res: Response) => {
  const { name, level, pageSize = 10, current = 1 } = req.query;

  const total = await Category.countDocuments(req.body);

  const data = await Category.find({
    ...(name && { name }),
    ...(level && { level }),
  })
    .skip((Number(current) - 1) * Number(pageSize))
    .sort({ updatedAt: -1 })
    .populate("parent");
  return res.status(200).json({ data, success: true, total });
});

// 获取详细信息
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  console.log(category);
  if (category) {
      res.status(200).json({ data: category, success: true });
  } else {
      res.status(500).json({ message: '该分类不存在' });
  }
});

//更新
router.put("/:id", async (req: Request, res: Response) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body);

  if (category) {
    res.status(200).json({ success: true });
  } else {
    res.status(500).json({ message: "该分类不存在" });
  }
});

//删除
router.delete("/:id", async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    await Category.deleteOne({
      _id: req.params.id,
    });
    return res.status(200).json({ success: true });
  } else {
    return res.status(500).json({ message: "分类不存在" });
  }
});

export default router;