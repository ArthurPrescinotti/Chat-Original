package org.Chat.service;

import org.Chat.model.Mensagem;
import org.Chat.repository.MensagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MensagemService {

    @Autowired
    private MensagemRepository mensagemRepository;

    public Mensagem save(Mensagem mensagem){
        mensagemRepository.save(mensagem);
        return mensagem;
    }

    public List<Mensagem> findAll(){
        return mensagemRepository.findAll();
    }

    public Optional<Mensagem> findById(String id){
        return mensagemRepository.findById(id);
    }

    public void deleteById(String id){
        mensagemRepository.deleteById(id);
    }
}
