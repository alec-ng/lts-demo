describe("LunchLearnCmp", function() {

    const INITIAL_STATE = "STATE-1";
    const AURA_ID_INPUT = "state-input";

    beforeEach(function() {
        // The doInit() on this component makes a call to the server side controller. 
        // We will mock this every time.
        let response = {
            getState : function() {
                return "SUCCESS";
            }, 
            getReturnValue: function() {
                return INITIAL_STATE;
            }
        };
        spyOn($A, "enqueueAction").and.callFake(function(action) {
            let callback = action.getCallback("SUCCESS");
            callback.fn.apply(callback.s, [response]);
        });
    });

    afterEach(function() {
        // Each spec (test) renders its components into the same div,
        // so we need to clear that div out at the end of each spec.
        $T.clearRenderedTestComponents();
    });

    // The param "done" is an optional argument for beforeEach(), it(), and afterEach()
    // It should be called when the async work is complete
    // Helps enforce the default 5 second timeout period Jasmine has for any async spec to finish

    it("gets an initial state from the server", function(done) {
        // Create component and assert
        $T.createComponent("c:LunchLearnCmp", {}, true)
            .then(function(cmp) {
                expect(cmp.get("v.currentState")).toBe(INITIAL_STATE);
                expect(cmp.get("v.stateHistoryStack").length).toBe(1);
                expect(cmp.get("v.stateHistoryStack")).toEqual([INITIAL_STATE]);
                expect(cmp.get("v.errorMsg")).toBeFalsy();
                done();
            })
            .catch(function(e) {
                done.fail(e);
            });
    });

    it("pushes a new state", function(done) {
        $T.createComponent("c:LunchLearnCmp", {}, true)
            .then(function(cmp) {
                const newState = "MY-NEW-STATE";
                let userInputEle = cmp.find(AURA_ID_INPUT);
                userInputEle.set("v.value", newState);
                cmp.pushState();

                let stateHistoryStack = cmp.get("v.stateHistoryStack");
                expect(cmp.get("v.currentState")).toBe(newState);
                expect(stateHistoryStack.length).toBe(2);
                expect(stateHistoryStack[1]).toBe(newState);

                done();
            })
            .catch(function(e) {
                done.fail(e);
            });
    });

    it("does not allow an empty or duplicate state to be pushed", function(done) {
        $T.createComponent("c:LunchLearnCmp", {}, true)
            .then(function(cmp) {
                let userInputEle = cmp.find(AURA_ID_INPUT);
                
                userInputEle.set("v.value", INITIAL_STATE);
                cmp.pushState();
                expect(cmp.get("v.stateHistoryStack").length).toBe(1);
                expect(cmp.get("v.errorMsg")).toBeTruthy();

                userInputEle.set("v.value", "");
                cmp.pushState();
                expect(cmp.get("v.stateHistoryStack").length).toBe(1);
                expect(cmp.get("v.errorMsg")).toBeTruthy();
                
                done();
            })
            .catch(function(e) {
                done.fail(e);
            });
    });

    it("does not allow popping a state if there's only 1 state in the stack", function(done) {
        $T.createComponent("c:LunchLearnCmp", {}, true)
            .then(function(cmp) {
                cmp.popState();
                expect(cmp.get("v.errorMsg")).toBeTruthy();
                expect(cmp.get("v.stateHistoryStack").length).toBe(1);

                done();
            })
            .catch(function(e) {
                done.fail(e);
            });
    });

    it("pops a state from the stack given there's more than 1 state", function(done) {
        $T.createComponent("c:LunchLearnCmp", {}, true)
            .then(function(cmp) {
                let userInputEle = cmp.find(AURA_ID_INPUT);
                userInputEle.set("v.value", "MY_STATE");
                cmp.pushState();
                expect(cmp.get("v.stateHistoryStack").length).toBe(2);
                expect(cmp.get("v.currentState"), "MY_STATE");

                cmp.popState();
                expect(cmp.get("v.stateHistoryStack").length).toBe(1);
                expect(cmp.get("v.currentState"), INITIAL_STATE);

                done();
            })
            .catch(function(e) {
                done.fail(e);
            });
    });

    it("renders the current state as a header on the page", function(done) {
        $T.createComponent("c:LunchLearnCmp", {}, true)
            .then(function(cmp) {
                let headerEle = document.getElementById("current-state-header");
                expect(headerEle.textContent).toContain(cmp.get("v.currentState"));

                done();
            })
            .catch(function(e) {
                done.fail(e);
            });
    });

});