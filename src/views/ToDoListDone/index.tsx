import styles from './index.module.scss';
import { todoStoreReducers, useToDoStore } from '../../data/stores/store';
import { useEffect } from 'react';

export const ToDoListDone: React.FC = () => {
  const { tasksDone, reducers } = useToDoStore();

  useEffect(() => {
    console.log('🚀 => 👍 ==>> ToDoListDone ==>> Line #7 ==>> ');
  }, [tasksDone]);

  return (
    <article className={styles.article}>
      <h1 className={styles.articleTitle}>Done tasks</h1>
      {!tasksDone.length && <p className={styles.articleText}>There is no one done task.</p>}
      {tasksDone.map((task, index) => (
        <p key={task.id} className={styles.articleTextLeft}>
          {index + 1}. {task.title}
        </p>
      ))}
      <br />
      <button className={styles.articleButton} onClick={reducers.createTaskDone}>
        Add fake done task
      </button>
      <br />

      {/* <button
                onClick={deleteEverything}
            >Delete everything</button> */}
      <br />
    </article>
  );
};
