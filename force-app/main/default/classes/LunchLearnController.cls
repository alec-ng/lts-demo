/**
 * Server side controller for LunchLearnCmp.cmp
 */
public with sharing class LunchLearnController {
    
   private static final String INITIAL_STATE = 'STATE-1';

    /**
     * Dummy method to return a test string
     */
    @AuraEnabled
    public static String getInitialState() {
        // Pretend there's some business logic here that determines what initial state
        // this component should have, and return it.

        return INITIAL_STATE;   
    }

}
