*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Login Valido Redireciona Para Dashboard
    Open Browser    http://localhost:5173/login    Chrome
    Input Text      id=cpf        12345678901
    Input Text      id=password   123456
    Click Button    xpath=//button[@type='submit']
    Wait Until Location Is    http://localhost:5173/dashboard
    Close Browser

Login Invalido Exibe Mensagem De Erro
    Open Browser    http://localhost:5173/login    Chrome
    Input Text      id=cpf        12345678901
    Input Text      id=password   senhaerrada
    Click Button    xpath=//button[@type='submit']
    Wait Until Element Is Visible    xpath=//*[contains(text(),'CPF ou senha incorretos')]
    Close Browser
