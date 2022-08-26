describe('Flowsheet Output Test', () => {
    it('test output page when valid input is solved', () => {
        let sc_count = 0

        //load webpage
        cy.visit('/')
        cy.screenshot(sc_count+'_loaded homepage')
        sc_count+=1

        //click foo and wait for api response
        cy.intercept({
            method: "GET",
            url: "http://localhost:8001/flowsheets/**",
        }).as("loadFlowsheet");
        cy.findByRole('link', {  name: /foo/i}).click()
        cy.wait("@loadFlowsheet");
        cy.screenshot(sc_count+'_loaded flowsheet')
        sc_count+=1

        //enter valid value for recovery rate twice to ensure it registers
        var recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.click({force:true})
        recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.type('{backspace}{backspace}{backspace}25')
        cy.wait(500)
        var recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.click({force:true})
        recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.type('{backspace}{backspace}{backspace}25')
        cy.screenshot(sc_count+'_input1')
        sc_count+=1

        //click on save and wait for api response
        cy.intercept({
            method: "POST",
            url: "http://localhost:8001/flowsheets/**",
        }).as("saveChanges");
        cy.findAllByRole('button', {  name: /save/i}).eq(0).click()
        cy.wait("@saveChanges");
        cy.screenshot(sc_count+'_saved1')
        sc_count+=1

        //need to do it twice to ensure changes are saved
        //enter valid value for recovery rate
        sc_count+=1
        recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.click({force:true})
        recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.type('{backspace}{backspace}{backspace}25',{force:true})
        cy.wait(500)
        var recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.click({force:true})
        recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.type('{backspace}{backspace}{backspace}25')
        cy.screenshot(sc_count+'_input2 after')
        sc_count+=1

        //click on save and wait for api response
        cy.intercept({
            method: "POST",
            url: "http://localhost:8001/flowsheets/**",
        }).as("saveChanges");
        cy.findAllByRole('button', {  name: /save/i}).eq(0).click()
        cy.wait("@saveChanges");
        cy.screenshot(sc_count+'_saved2')
        sc_count+=1

        //click on solve and wait for api response
        cy.intercept({
            method: "GET",
            url: "http://localhost:8001/flowsheets/**",
        }).as("solve");
        cy.findAllByRole('button', {  name: /solve/i}).eq(0).click()
        cy.wait("@solve");
        cy.screenshot(sc_count+"solved")
        sc_count+=1

        //find output categories
        cy.findByRole('button', {name: /system metrics/i})
        cy.findByRole('button', {name: /feed/i})
        cy.findByRole('button', {name: /product/i})
        cy.findByRole('button', {name: /decision variables/i})
        cy.findByRole('button', {name: /system variables/i})
        cy.findByRole('button', {name: /disposal/i})

        //click save configuration button
        cy.findByRole('button', {name: /save configuration/i}).click()
        cy.wait(1000)
        cy.screenshot(sc_count+'_pre saveConfig')
        sc_count+=1

        //clear preset name and enter new name
        cy.wait(1000)
        cy.get('.MuiInput-input').should('be.visible')
        cy.get('.MuiInput-input', { timeout: 10000 }).clear({ force: true })
        cy.get('.MuiInput-input', { timeout: 10000 }).type('new_test_configuration', { force: true })
        cy.screenshot(sc_count+'_saveConfig')
        sc_count+=1

        
        //click on save (config) and wait for api response
        cy.intercept({
            method: "POST",
            url: "http://localhost:8001/flowsheets/**",
        }).as("saveConfig");
        cy.findByRole('button', {name: /save/i}).click()
        cy.wait("@saveConfig");
        cy.screenshot(sc_count+'_saved config')
        sc_count+=1

        //click compare tab
        cy.findByRole('tab', {name: /compare/i}).click()

        //verify that new name is shown in comparison table
        cy.findAllByRole('button', {name: /new_test_configuration/i})

        cy.screenshot(sc_count+'_end-test')
    })

})