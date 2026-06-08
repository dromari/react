import { useState, useEffect } from 'react';
import { Modal } from './components/Modal/Modal';
import { UncontrolledForm } from './components/Forms/UncontrolledForm';
import { ControlledForm } from './components/Forms/ControlledForm';
import { FormSubmission, useFormStore } from './shared/store';
import styles from './App.module.css';

interface SubmissionCardProps {
  item: FormSubmission;
}

const SubmissionCard = ({ item }: SubmissionCardProps) => {
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const ageInMs = Date.now() - item.submittedAt;
    if (ageInMs < 4000) {
      setIsNew(true);
      const timer = setTimeout(() => setIsNew(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [item.submittedAt]);

  const cardClassName = `${styles.card} ${isNew ? styles.cardNew : ''}`;

  return (
    <div className={cardClassName}>
      <div className={styles.cardHeader}>
        {item.image ? (
          <img src={item.image} alt={item.name} className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {item.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className={styles.cardInfo}>
          <h3 className={styles.cardName}>{item.name}</h3>
          <p className={styles.cardEmail}>{item.email}</p>
        </div>
      </div>
      <div className={styles.cardFooter}>
        <p>
          <b>Age:</b> {item.age} years
        </p>
        <p>
          <b>Country:</b> {item.country}
        </p>
      </div>
    </div>
  );
};

function App() {
  const { submissions } = useFormStore();
  const [modalType, setModalType] = useState<
    'uncontrolled' | 'controlled' | null
  >(null);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>React Forms Task</h1>
        </div>
        <div className={styles.btnGroup}>
          <button
            onClick={() => setModalType('uncontrolled')}
            className={styles.btnUncontrolled}
          >
            Uncontrolled Form
          </button>
          <button
            onClick={() => setModalType('controlled')}
            className={styles.btnControlled}
          >
            React Hook Form
          </button>
        </div>
      </header>

      <main className={styles.mainContent}>
        <h2 className={styles.mainTitle}>
          Sending history ({submissions.length})
        </h2>
        {submissions.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No forms have been submitted yet...</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {[...submissions].reverse().map((item) => (
              <SubmissionCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>

      <Modal
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        title={
          modalType === 'uncontrolled'
            ? 'Uncontrollable form'
            : 'React Hook Form'
        }
      >
        {modalType === 'uncontrolled' && (
          <UncontrolledForm onSuccess={() => setModalType(null)} />
        )}
        {modalType === 'controlled' && (
          <ControlledForm onSuccess={() => setModalType(null)} />
        )}
      </Modal>
    </div>
  );
}

export default App;
