# Bazinga-Delivery

Documento de Requisitos Funcionais
Sistema: Bazinga Delivery
1. Introdução
O Bazinga Delivery é um aplicativo de delivery de comida que visa conectar usuários a restaurantes, permitindo a realização de pedidos de forma prática e eficiente. Este documento descreve os principais requisitos funcionais do sistema.

2. Objetivos
Facilitar o cadastro e a autenticação de usuários.
Permitir que usuários visualizem e façam pedidos de itens de cardápios de restaurantes.
Gerenciar o estado dos pedidos, incluindo criação e remoção.
Prover uma interface amigável para interação com o sistema.
3. Requisitos Funcionais
3.1. Cadastro de Usuários
01: O sistema deve permitir que novos usuários se cadastrem, fornecendo nome, email e senha.
02: O sistema deve validar se o email informado já está cadastrado.
03: O sistema deve armazenar as informações dos usuários em um banco de dados.
3.2. Autenticação de Usuários
04: O sistema deve permitir que usuários cadastrados façam login com seu email e senha.
05: O sistema deve permitir que usuários autenticados acessem funcionalidades restritas, como visualizar pedidos e fazer novos pedidos.
3.3. Cadastro e Gerenciamento de Restaurantes
06: O sistema deve permitir que administradores cadastrem novos restaurantes, incluindo nome, descrição e tipo de cozinha.
07: O sistema deve permitir que administradores removam restaurantes existentes.
3.4. Gerenciamento de Itens do Cardápio
08: O sistema deve permitir que administradores cadastrem itens de cardápio para cada restaurante, incluindo nome, descrição e preço.
09: O sistema deve permitir que administradores removam itens do cardápio.
3.5. Realização de Pedidos
10: O sistema deve permitir que usuários visualizem a lista de itens disponíveis no cardápio de restaurantes.
11: O sistema deve permitir que usuários façam pedidos selecionando itens do cardápio e associando-os a um restaurante.
12: O sistema deve registrar o status de cada pedido (ex: pendente, em preparo, entregue).
3.6. Visualização de Pedidos
13: O sistema deve permitir que usuários visualizem seus pedidos realizados, com detalhes como item, restaurante e status do pedido.
14: O sistema deve permitir que usuários removam pedidos realizados.
4. Considerações Finais
Este documento fornece uma visão geral dos requisitos funcionais do sistema Bazinga Delivery. O desenvolvimento deve seguir essas diretrizes para garantir que todas as funcionalidades atendam às necessidades dos usuários e administradores.
