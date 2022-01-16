import { Connection } from '../../Config';

export class ThreadService {
  static conn = Connection.client;

  /**
   * Create a new thread
   */
  static async createNewThread() {}

  /**
   * Get all threads from board
   */
  static async getAllThreads() {}

  /**
   * Add a thread reply
   */
  static async addNewReply() {}

  /**
   * Get all replies from thread
   */
  static async getAllReplies() {}

  /**
   * Edit a thread
   */
  static async editThread() {}

  /**
   * Edit a reply
   */
  static async editReply() {}
}
