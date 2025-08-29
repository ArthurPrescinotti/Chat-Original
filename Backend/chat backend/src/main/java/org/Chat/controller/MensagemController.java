package org.Chat.controller;

import org.Chat.constant.Constant;
import org.Chat.model.Mensagem;
import org.Chat.service.MensagemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:8081", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
        RequestMethod.DELETE})
public class MensagemController {

    @Autowired
    private MensagemService mensagemService;

    @PostMapping(Constant.API_CHAT)
    public ResponseEntity<Mensagem> createMensagem(@RequestBody Mensagem mensagem){
        Mensagem savedMensagem = mensagemService.save(mensagem);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMensagem);
    }

    @PutMapping(Constant.API_CHAT + "/{id}")
    public ResponseEntity<Mensagem> deleteById (@PathVariable("id") String id){
        mensagemService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(Constant.API_CHAT)
    public ResponseEntity<List<Mensagem>> findAll(){
        return ResponseEntity.ok(mensagemService.findAll());
    }

    @GetMapping(Constant.API_CHAT + "{id}")
    public ResponseEntity<Optional<Mensagem>> findById(@PathVariable("id") String id){
        return ResponseEntity.ok(mensagemService.findById(id));
    }
}
