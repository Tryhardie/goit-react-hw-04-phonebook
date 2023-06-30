import { useState, useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import Section from 'components/Section/Section';
import ContactForm from 'components/ContactForm/ContactForm';
import ContactList from 'components/ContactList/ContactList';
import Filter from 'components/Filter/Filter';
import { Container } from 'styles/App.styled';

const App = () => {
  const [contacts, setContacts] = useState(
    () => JSON.parse(localStorage.getItem('stored-contacts')) ?? []
  );
  const [filter, setFilter] = useState('');
  const firstLoad = useRef(false);

  useEffect(() => {
    localStorage.setItem('stored-contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    if (!firstLoad.current) {
      firstLoad.current = true;
    }
  }, []);

  const addContact = e => {
    e.preventDefault();

    const form = e.target;
    const { name, number } = form.elements;
    const contact = {
      id: nanoid(),
      name: name.value,
      number: number.value,
    };

    if (contacts.find(contact => contact.name === name.value) && firstLoad) {
      Notify.warning(`${contact.name} is already in contacts`);
      return;
    }

    setContacts(prevContacts => [...prevContacts, contact]);
    form.reset();
  };

  const deleteContact = id => {
    setContacts(prevState => prevState.filter(contact => contact.id !== id));
  };

  const filteringInput = e => {
    setFilter(e.target.value);
  };

  const filteredContacts = () => {
    const lovercase = filter.toLowerCase();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(lovercase)
    );
  };

  return (
    <Container>
      <Section title="Phonebook">
        <ContactForm onSubmit={addContact} />
      </Section>
      <Section title="Contacts">
        {contacts.length > 1 && (
          <Filter value={filter} onChange={filteringInput} />
        )}
        {contacts.length > 0 ? (
          <ContactList
            contacts={filteredContacts()}
            deleteContact={deleteContact}
          />
        ) : (
          firstLoad.current && Notify.info('Contact book is empty')
        )}
      </Section>
    </Container>
  );
};

export default App;
