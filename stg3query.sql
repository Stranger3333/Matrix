SELECT *
FROM movie m
WHERE runtime =
      (SELECT MAX(runtime) FROM movie m group by m.language having m.language = 'japanese') AND
      language = 'japanese'
UNION
SELECT *
FROM movie m
WHERE runtime =
      (SELECT MAX(runtime) FROM movie m group by m.language having m.language = 'korean') AND
      language = 'korean';

SELECT COUNT(p.peopleid),mp.category
FROM movie m inner join mp mp ON (m.movie_id=mp.tconst) INNER JOIN People p ON (mp.nconst=p.peopleid)
WHERE m.type LIKE '%Documentary%'
group by mp.category;