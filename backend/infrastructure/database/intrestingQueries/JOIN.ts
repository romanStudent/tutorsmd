// Aufgabe 1
SELECT m.firstname || ' ' || m.surname AS member, f.name AS facility FROM cd.members m JOIN cd.bookings b ON m.memid=b.memid JOIN cd.facilities f ON f.facid=b.facid WHERE f.name LIKE 'Tennis Court%' GROUP BY member, facility;  
// OR
select distinct mems.firstname || ' ' || mems.surname as member, facs.name as facility
	from 
		cd.members mems
		inner join cd.bookings bks
			on mems.memid = bks.memid
		inner join cd.facilities facs
			on bks.facid = facs.facid
	where
		facs.name in ('Tennis Court 2','Tennis Court 1')
order by member, facility  

// Aufgabe 2
SELECT m.firstname || 'GUEST ' || m.surname || 'GUEST' AS member, f.name AS facility, f.guestcost AS cost FROM cd.members m JOIN cd.bookings b ON f.facid=b.facid JOIN cd.facilities f ON m.memid=b.memid WHERE






// Aufgabe 3
SELECT companies.category_code,
       COUNT(CASE WHEN acquisitions.acquired_at_cleaned <= companies.founded_at_clean::timestamp + INTERVAL '3 years'
                       THEN 1 ELSE NULL END) AS acquired_3_yrs,
       COUNT(CASE WHEN acquisitions.acquired_at_cleaned <= companies.founded_at_clean::timestamp + INTERVAL '5 years'
                       THEN 1 ELSE NULL END) AS acquired_5_yrs,
       COUNT(CASE WHEN acquisitions.acquired_at_cleaned <= companies.founded_at_clean::timestamp + INTERVAL '10 years'
                       THEN 1 ELSE NULL END) AS acquired_10_yrs,
       COUNT(1) AS total
  FROM tutorial.crunchbase_companies_clean_date companies
  JOIN tutorial.crunchbase_acquisitions_clean_date acquisitions
    ON acquisitions.company_permalink = companies.permalink
 WHERE founded_at_clean IS NOT NULL
 GROUP BY 1
 ORDER BY 5 DESC