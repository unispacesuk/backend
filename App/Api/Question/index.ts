import { Router } from 'express';
import { QuestionController } from './QuestionController';

const Question: Router = Router();
export { Question };

Question.use('/question', [new QuestionController().route]);
