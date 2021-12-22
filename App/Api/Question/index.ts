import { Router } from 'express';
import {PostQuestion} from "./PostQuestion";
import {GetQuestion} from "./GetQuestion";

const Question: Router = Router();
export { Question };

/**
 * Question Endpoints
 *  - Post Question
 */
Question.use('/question', [
  new PostQuestion().route,
  new GetQuestion().route
]);