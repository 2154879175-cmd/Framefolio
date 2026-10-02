ALTER TABLE `movies` ADD `stills_json` text DEFAULT '[]' NOT NULL;
--> statement-breakpoint
UPDATE movies SET stills_json = '["https://image.tmdb.org/t/p/w780/ffQFnAUm2Uu4RU0nijpjPRf9TBT.jpg","https://image.tmdb.org/t/p/w780/9JZKUOQdQPTJ4OdYKttYOQCREdw.jpg","https://image.tmdb.org/t/p/w780/gx3Iat10dc39XbDwbmdfKPsow3U.jpg"]' WHERE tmdb_id = 843 AND stills_json = '[]';

--> statement-breakpoint
UPDATE movies SET stills_json = '["/film-stills/1949-1.jpg","/film-stills/1949-2.jpg","/film-stills/1949-3.jpg"]' WHERE tmdb_id = 1949 AND stills_json = '[]';

--> statement-breakpoint
UPDATE movies SET stills_json = '["https://image.tmdb.org/t/p/w780/iiPBXynI88EgnpunHoUlBCnLpSE.jpg","https://image.tmdb.org/t/p/w780/bjKTwVrzX2cflxRhvAlqvOdloTG.jpg","https://image.tmdb.org/t/p/w780/7MwDOMrbjrKP3XQ5vw4cgB2DPaF.jpg"]' WHERE tmdb_id = 2832 AND stills_json = '[]';

--> statement-breakpoint
UPDATE movies SET stills_json = '["https://image.tmdb.org/t/p/w780/sBB39VMtByFltGGGW2c5N6LOAvj.jpg","https://image.tmdb.org/t/p/w780/yU5KUTk653SgITAIVxBS6WEyTQx.jpg","https://image.tmdb.org/t/p/w780/6EM4kHDYTc5RA8SCGtecaEH7Khj.jpg"]' WHERE tmdb_id = 8470 AND stills_json = '[]';

--> statement-breakpoint
UPDATE movies SET stills_json = '["/film-stills/122917-1.jpg","/film-stills/122917-2.jpg","/film-stills/122917-3.jpg"]' WHERE tmdb_id = 122917 AND stills_json = '[]';

--> statement-breakpoint
UPDATE movies SET stills_json = '["/film-stills/157336-1.jpg","/film-stills/157336-2.jpg","/film-stills/157336-3.jpg"]' WHERE tmdb_id = 157336 AND stills_json = '[]';

--> statement-breakpoint
UPDATE movies SET stills_json = '["/film-stills/411088-1.jpg","/film-stills/411088-2.jpg","/film-stills/411088-3.jpg"]' WHERE tmdb_id = 411088 AND stills_json = '[]';

--> statement-breakpoint
UPDATE movies SET stills_json = '["/film-stills/489999-1.jpg","/film-stills/489999-2.jpg","/film-stills/489999-3.jpg"]' WHERE tmdb_id = 489999 AND stills_json = '[]';

--> statement-breakpoint
UPDATE movies SET stills_json = '["/film-stills/1339713-1.jpg","/film-stills/1339713-2.jpg","/film-stills/1339713-3.jpg"]' WHERE tmdb_id = 1339713 AND stills_json = '[]';
