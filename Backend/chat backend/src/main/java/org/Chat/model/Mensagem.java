package org.Chat.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document
@Getter @Setter
public class Mensagem {

    @Id
    private String id;
    private String nome;
    private String mensagem;
    private Date data;
}
