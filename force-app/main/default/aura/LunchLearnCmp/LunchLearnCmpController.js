({
    /**
     * Gets an initial state from the server side controller, and assigns it to v.initialState,
     * and v.stateHistoryStack
     */
    getState: function(cmp, event, helper) {
        let action = cmp.get("c.getInitialState");
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                let initialState = response.getReturnValue();
                cmp.set("v.currentState", initialState);
                cmp.set("v.stateHistoryStack", [initialState]);
                cmp.set("v.displayStack", [initialState]);
            } else {
                cmp.set("v.errorMsg", "Whoops, something went wrong behind the scenes! Please refresh and try again.");
            }
        });
        $A.enqueueAction(action);
    },

    /**
     * Pushes the state defined by v.userState onto the history stack and sets the currentState to
     * the top of the stack. 
     * 
     * @precondition The state defined by v.userState cannot previously exist in the stack
     */
    pushState: function(cmp, event, helper) {
        let userState = cmp.get("v.userState");
        if (!userState || !userState.trim()) {
            cmp.set("v.errorMsg", "Please enter a non empty value for the new state.");
            return;
        }

        let stateHistoryStack = cmp.get("v.stateHistoryStack");
        if (stateHistoryStack.indexOf(userState) !== -1) {
            cmp.set("v.errorMsg", userState + " already exists. Please enter another value.");
            return;
        }

        stateHistoryStack.push(userState);
        cmp.set("v.stateHistoryStack", stateHistoryStack);
        cmp.set("v.displayStack", stateHistoryStack.reverse());
        cmp.set("v.currentState", userState);
        cmp.set("v.userState", "");
        cmp.set("v.errorMsg", "");
    },

    /**
     * Removes the top of v.stateHistoryStack and sets the currentState to the new top
     * 
     * @precondition v.stateHistoryStack must have a size greater than 1
     */
    popState: function(cmp, event, helper) {
        let stateHistoryStack = cmp.get("v.stateHistoryStack");
        if (stateHistoryStack.length <= 1) {
            cmp.set("v.errorMsg", "You cannot have an empty stack. Push a state before popping.");
            return;
        }
        
        stateHistoryStack.pop();

        cmp.set("v.currentState", stateHistoryStack[stateHistoryStack.length - 1]);
        cmp.set("v.stateHistoryStack", stateHistoryStack);
        cmp.set("v.displayStack", stateHistoryStack.reverse());
        cmp.set("v.errorMsg", "");
    }

})
