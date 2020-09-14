<!doctype html>
<html>
   <head>
      <meta charset='UTF-8' />
      <title>Reaction Database Response</title>
      <link rel ='shortcut icon' href='CGU_logo2.ico' />
   </head>
   <body style='background-color: #e9ecef; font-family: Avenir'>
      <pre>
      <?php
         global $connection;
         global $elapsedTime;
         global $result;
         global $subjectID;
         $elapsedTime = $_GET[ 'elapsedTime' ];
         $subjectID   = $_GET[ 'subjectID' ];
         
         error_reporting( E_ALL );
         ini_set( "display_errors", 1 );
         print "<h1 class='title'>Reaction Test database insertion</h1>";

         $dbhost = "adrian.lmu.build";
         $dbuser = "adrianlm";
         $dbpass = "8006Person";
         $dbname = "adrianlm_SURP_2020";
         $connection = mysqli_connect( $dbhost, $dbuser, $dbpass, $dbname );
         if($connection) {
            print "CONNECTED to SURP database...<br />";
         } else {
            print "Connection to SURP database FAILED...<br />";
         }
         if($connection) {
            print "Writing your data to the Reaction Test table....<br />";
            $query = "INSERT INTO `Reaction_Table`( `subjectID`,`elapsedTime`) VALUES ( '$subjectID', '$elapsedTime')";
            $result = mysqli_query( $connection, $query );
            if( !$result ) {
               print "<strong style='font-size: 150%; color: red;'><br /> Database insertion FAILED...</strong><br />";
               print "<p>Please write down the following values and " .
                     "e-mail them to <a href='mailto:aleung2@lion.lmu.edu'>Adrian Leung</a>.</p>";
               print "<blockquote style='font-size: 125%;'><strong>Your Subject ID: " . $subjectID . "<br />" .
                     "Your elapsed time: " . $elapsedTime . "<br />" .
                     "</strong></blockquote><br /><br />";
            } else {
               print  "<h3 style='font-size: 200%; background-color: #cfbdbd; width: 100%; text-align:center;'>Your data has been successfully saved!</h3><br />";
            }
         }

         if( $connection ) {
            print "Performing Verification....<br /><br />";
            $query = "SELECT subjectID, elapsedTime FROM `Reaction_Table`;";
            $result = mysqli_query( $connection, $query );
            if( !$result ) {
               print "DATABASE Verification FAILED...<br />";
               print "<p>Please write down the following values and " .
                     "e-mail them to <a href='mailto:aleung@lion.lmu.edu'>Adrian Leung</a>.</p>";
               print "<blockquote style='font-size: 125%;'><strong>Your Subject ID: " . $subjectID . "<br />" .
                     "Your elapsed time: " . $elapsedTime . "<br />" .
                     "</strong></blockquote><br /><br />";
            } else {
               while( $row = mysqli_fetch_row( $result ) ) {
                  if( $row[0] == $subjectID ) {
                     print "<strong style='font-size: 125%; color: green;'>Database Verification Successful</strong><br />";
                     print "<br /><br /><h2 style='font-size: 150%; text-align: center; color: green;'>" .
                           "Your Data has been successfully saved.<br />" .
                           "Thank you for your participation in the Reaction Test!</h2>";
                  }
               }
            }
         }

         $result->free();
         mysqli_close( $connection );
      ?>

      </pre>
   </body>
</html>