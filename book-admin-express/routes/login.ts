import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../model';
import { SCRET_KEY } from '../constant';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    const {name, password} = req.body;
    const user = await User.findOne({ name, password });
    if( user ){
        const token = jwt.sign({id:user._id}, SCRET_KEY, {expiresIn: '1h'});
        res.status(200).json({ data: user, success: true, token });
    }else{
        res.status(500).json({ message: '账号或密码错误' });
    }
});

export default router;