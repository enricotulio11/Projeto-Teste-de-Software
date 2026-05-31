*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Dashboard Sem Login Redireciona Para Login
    Open Browser    http://localhost:5173/dashboard    Chrome
    Wait Until Location Is    http://localhost:5173/login
    Close Browser

Adicionar Dependente Valido
    Open Browser    http://localhost:5173/login    Chrome
    Wait Until Element Is Visible    id=cpf    10s
    Input Text      id=cpf        12345678901
    Input Text      id=password   123456
    Click Button    xpath=//button[@type='submit']
    Wait Until Location Is    http://localhost:5173/dashboard    10s
    Wait Until Element Is Visible    xpath=//button[contains(., 'Gerenciar Dependentes')]    10s
    Click Button    xpath=//button[contains(., 'Gerenciar Dependentes')]
    Wait Until Location Is    http://localhost:5173/dependentes    10s
    Wait Until Element Is Visible    xpath=//h1[contains(text(),'Gerenciar Dependentes')]    10s
    Click Button    xpath=//button[contains(., 'Adicionar Dependente')]
    Wait Until Element Is Visible    id=name    10s
    Input Text      id=name           Neymar da Silva
    Input Text      id=cpf            15060769046
    Input Text      id=dateOfBirth    2010-05-15
    Click Element   xpath=//button[@id='relationship']
    Wait Until Element Is Visible    xpath=//div[@role='option' and contains(., 'Filho')]    10s
    Click Element   xpath=//div[@role='option' and contains(., 'Filho')]
    Click Button    xpath=//button[contains(., 'Salvar Perfil')]
    Wait Until Page Contains    cadastrado com sucesso    10s
    Wait Until Page Contains    Neymar da Silva    10s
    Close Browser
