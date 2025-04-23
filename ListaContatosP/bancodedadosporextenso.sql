-- PARTE 1

-- Tabela de Clientes
CREATE TABLE Clientes (
    ClienteID INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Telefone VARCHAR(15) NOT NULL
);

-- Tabela de Endereços
CREATE TABLE Enderecos (
    EnderecoID INT AUTO_INCREMENT PRIMARY KEY,
    ClienteID INT NOT NULL,
    Rua VARCHAR(150),
    Cidade VARCHAR(100),
    Estado VARCHAR(50),
    CEP VARCHAR(10),
    FOREIGN KEY (ClienteID) REFERENCES Clientes(ClienteID)
);


-- PARTE 2

INSERT INTO Clientes (Nome, Email, Telefone)
VALUES ('Seu Nome Aqui', 'seu@email.com', '11999999999');

-- PARTE 3

-- Cliente 1
INSERT INTO Clientes (Nome, Email, Telefone)
VALUES ('Ana Souza', 'ana.souza@email.com', '11988887777');

-- Cliente 2
INSERT INTO Clientes (Nome, Email, Telefone)

-- Cliente 3
INSERT INTO Clientes (Nome, Email, Telefone)
VALUES ('Camila Rocha', 'camila.rocha@email.com', '31966665555');


-- PARTE 4 

SELECT * FROM Clientes
ORDER BY Nome ASC;

-- PARTE 5 

INSERT INTO Clientes (Nome, Email, Telefone) VALUES
('João Silva', 'joao.silva@email.com', '11991234567'),
('Maria Oliveira', 'maria.oliveira@email.com', '11987654321'),
('Carlos Lima', 'carlos.lima@email.com', '21999887766'),
('Ana Souza', 'ana.souza@email.com', '31996543210'),
('Fernanda Castro', 'fernanda.castro@email.com', '41999881234'),
('Ricardo Moreira', 'ricardo.moreira@email.com', '51991239876'),
('Paula Fernandes', 'paula.fernandes@email.com', '62998765432'),
('Marcos Vinicius', 'marcos.vinicius@email.com', '71996547896'),
('Juliana Prado', 'juliana.prado@email.com', '81991234567'),
('Rafael Almeida', 'rafael.almeida@email.com', '11996543218'),
('Camila Ramos', 'camila.ramos@email.com', '21998761234'),
('Luciano Braga', 'luciano.braga@email.com', '31997654321'),
('Beatriz Nunes', 'beatriz.nunes@email.com', '41999887711'),
('Gabriel Rocha', 'gabriel.rocha@email.com', '51991238976'),
('Larissa Martins', 'larissa.martins@email.com', '62998764123'),
('Thiago Costa', 'thiago.costa@email.com', '71996547890'),
('Isabela Lopes', 'isabela.lopes@email.com', '81991234678'),
('Eduardo Pinto', 'eduardo.pinto@email.com', '11998877665'),
('Vanessa Moura', 'vanessa.moura@email.com', '21996543219'),
('Felipe Andrade', 'felipe.andrade@email.com', '31997654123');


-- PARTE 6

DELETE FROM Clientes
WHERE ClienteID IN (3, 7, 10);


-- PARTE 7

INSERT INTO Enderecos (ClienteID, Rua, Cidade, Estado, CEP) VALUES
(1, 'Rua A, 100', 'São Paulo', 'SP', '01001-000'),
(2, 'Rua B, 200', 'Rio de Janeiro', 'RJ', '20001-000'),
(3, 'Rua C, 300', 'Belo Horizonte', 'MG', '30001-000'),
(4, 'Rua D, 400', 'Porto Alegre', 'RS', '90001-000'),
(5, 'Rua E, 500', 'Curitiba', 'PR', '80001-000'),
(6, 'Rua F, 600', 'Recife', 'PE', '50001-000'),
(7, 'Rua G, 700', 'Fortaleza', 'CE', '60001-000'),
(8, 'Rua H, 800', 'Salvador', 'BA', '40001-000'),
(9, 'Rua I, 900', 'Manaus', 'AM', '69001-000'),
(10, 'Rua J, 1000', 'Belém', 'PA', '66001-000');


-- PARTE 8

SHOW COLUMNS FROM Enderecos

