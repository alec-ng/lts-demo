<aura:application
    description="Custom Jasmine test runner. It uses the lts_jasmineRunner component from the LTS unmanaged
        package, which takes a comma delimited string of Resource paths pointing to your test classes. 
        Running the app in the browser or through the CLI will execute the Jasmine tests.">

    <c:lts_jasmineRunner testFiles="{!join(',', 
    	    $Resource.LunchLearnTestSuite
        )}" 
    />

</aura:application>