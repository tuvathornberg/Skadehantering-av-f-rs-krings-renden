# Verktyg för skadehantering

Det här projektet ska utveckla ett verktyg som automatiserar och förenklar TAF:s hantering av misstänkta och konstaterade vattenskador enligt processunderlaget `taf_vattenskadeprocess`.

## Mål

Verktyget ska hjälpa handläggaren att:

- registrera och prioritera nya skadeärenden
- följa rätt steg i processen och tydliggöra nästa aktivitet
- dokumentera kontakter, beslut, bilder, rapporter och fakturor
- hålla ordning på ansvar mellan TAF, styrelse, boende, entreprenör och försäkringsbolag
- fånga upp försäkrings-, garanti-, avtals- och eskaleringsfrågor
- säkerställa att ärendet är komplett innan avslut

Verktyget ska vara ett beslutsstöd och en processmotor. Det ska inte själv fatta juridiska, försäkringsmässiga eller ekonomiska beslut.

## Förtydliganden från hackathon-transkriptionen

Transkriptionen används som verksamhetsunderlag och kompletterar processdokumentet. Den beskriver arbetssätt i praktiken, men ersätter inte aktuellt avtal, försäkringsvillkor eller beslutad rutin.

- Akut avhjälpande sker ofta genom att teknisk förvaltare ringer ut fastighetsskötare, rörfirma eller saneringsfirma direkt. Beställningen ska därefter kopplas till ärendet och kompletteras med referens via e-post eller system.
- När det akuta är avhjälpt beställs normalt en fuktutredning. Skadeanmälan kan i praktiken göras parallellt och kompletteras med utredningsrapporten när den är klar.
- Försäkringsbolagens arbetssätt varierar: telefon, webbformulär och ibland krav på egen utredare eller entreprenör. Verktyget måste därför stödja flera försäkringsspår.
- Entreprenörsvalet behöver dokumenteras. Antingen hanterar försäkringsbolagets entreprenör hela skadan eller så driver TAF/SBC en egen entreprenör genom kalkyl, åtgärd och uppföljning.
- Kostnadsuppskattning kan kräva ett extra platsbesök, mätning av ytor/material och reviderade kalkyler. Kalkylunderlaget ska kunna versioneras.
- Föreningens byggtekniska återställning går normalt fram till ytskikt. Ytskikt och inre återställning hanteras normalt av den boendes försäkring, med undantag som behöver bedömas manuellt.
- Slutkontroll ska verifiera att konstruktionen är torr och att föreningens del är klar. Därefter hanteras självrisk, eventuell el-/avfuktningskostnad och arkivering innan ärendet stängs.
- Styrelsen kan beställa enbart akut hjälp och därefter ta över resten. Ärendets hanteringsomfattning måste därför vara ett explicit val, inte ett antagande.

## Föreslaget ärendeflöde

1. **Mottaget ärende** – kontrollera registrering, underlag och akutläge.
2. **Akutåtgärd** – säkerställ skadebegränsning och dokumentera vad som gjorts.
3. **Uppdrag klargörs** – fastställ om SBC/TAF eller styrelsen hanterar ärendet.
4. **Garanti och utredning** – kontrollera garantier och beställ fuktutredning vid behov.
5. **Åtgärdsbedömning** – avgör om vidare åtgärd krävs och dokumentera beslutet.
6. **Försäkringsbedömning** – kontrollera försäkring, basbelopp, avtal och eventuell skadeanmälan. Stöd parallell hantering med fuktutredning.
7. **Försäkringsbesked** – registrera besked och informera berörda parter.
8. **Kalkyl och åtgärd** – hantera platsbesök, kalkylversioner, beställning, egenkontroller och slutbesiktning.
9. **Kostnadsreglering** – samla fakturor, ersättningsunderlag och eventuell debitering.
10. **Avslut** – kontrollera att åtgärd, dokumentation och kostnader är klara.

## Ärendestatusar för en första version

- Nytt
- Akut åtgärd krävs
- Avvaktar uppdrag från styrelsen
- Utredning beställd
- Utredning klar – beslut krävs
- Försäkringshantering pågår
- Avvaktar försäkringsbesked
- Åtgärd beställd
- Åtgärd pågår
- Kostnadsreglering pågår
- Klart för avslut
- Avslutat
- Eskalerat

## Automatiseringar i MVP

- skapa checklista utifrån skadetyp och aktuell status
- markera obligatoriska uppgifter och dokument som saknas
- föreslå nästa steg och ansvarig roll
- registrera muntlig akutbeställning och koppla den till ärendet
- stödja parallella spår för fuktutredning och skadeanmälan
- visa vem som äger nästa aktivitet: TAF, styrelse, försäkringsbolag, boende eller entreprenör
- hantera försäkringsbolagets entreprenör kontra TAF/SBC:s entreprenör
- versionshantera kalkyler och kostnadsuppskattningar
- skapa påminnelser för styrelse, boende, entreprenör och försäkringsbolag
- flagga akutläge, större skada, oklar ansvarsfördelning, garanti och saknad försäkring
- generera sammanfattning inför kontakt med styrelse eller försäkringsbolag
- kontrollera att avslutskriterierna är uppfyllda

## Viktiga manuella beslut

Följande ska kräva bekräftelse av behörig användare:

- om skadan är akut och vilka åtgärder som ska beställas
- om SBC/TAF ska hantera ärendet eller om det ska lämnas över till styrelsen
- om skadeanmälan ska göras och vilket underlag som skickas
- val av entreprenör, beställning och kostnadsansvar
- godkännande av försäkringsbesked
- om styrelsen tar över efter akutåtgärden
- om föreningens byggtekniska del är klar efter slutkontroll
- avslut av ärendet

## Minsta datamodell

Ett ärende behöver minst innehålla:

- förening, fastighet, lägenhet och kontaktpersoner
- inkomstdatum, källa och skadebeskrivning
- akutstatus och skadeomfattning
- ansvarig handläggare och aktuell status
- styrelsens uppdrag och beslut
- garanti-, avtals- och försäkringsuppgifter
- hanteringsomfattning: hela processen, endast akutåtgärd eller styrelseövertagande
- akutbeställning, beställningskanal, entreprenör och referens
- fuktutredning, åtgärdsförslag och beslut
- försäkringsbolagets arbetssätt, skadeanmälan och vald entreprenörsmodell
- entreprenörer, beställningar, kalkylversioner och tidsplan
- ansvar för stomme, ytskikt, avfuktning och elförbrukning
- kontakter och händelselogg
- dokument, bilder, rapporter, egenkontroller och fakturor
- kostnadsansvar och avslutsdatum

## Nästa steg

1. Bekräfta vilka användarroller som ska ingå i MVP.
2. Bestäm var verktyget ska användas: webbläsare, SBC Hemma-integration eller fristående prototyp.
3. Ta fram ett första formulär för att registrera ett skadeärende inklusive hanteringsomfattning och akutbeställning.
4. Bygg parallella aktiviteter för fuktutredning och skadeanmälan.
5. Lägg till entreprenörsmodell, kalkylversioner och ansvarsfördelning.
6. Testa flödet mot ett verkligt, anonymiserat exempelärende.
