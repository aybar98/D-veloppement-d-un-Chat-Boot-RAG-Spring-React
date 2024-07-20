package com.example.chatbot.services;

import com.example.chatbot.PersonRepository;
import com.example.chatbot.entities.Person;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.crud.CrudRepositoryService;

@BrowserCallable
@AnonymousAllowed
public class PersonService extends CrudRepositoryService<Person, Long, PersonRepository> {
}
