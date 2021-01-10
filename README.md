# arte addon for [mediaurl.io](https://www.mediaurl.io)

This addon was created with the [MediaURL Javascript SDK](https://github.com/mediaurl/mediaurl-js).

## Start the development addon server

```shell
npm i
npm run develop
```

### Developer notes

Get list:
https://www.arte.tv/guide/api/emac/v3/en/web/data/VIDEO_LISTING/?imageFormats=landscape&videoType=MOST_RECENT&page=3&limit=20

Get item:
https://www.arte.tv/guide/api/emac/v3/en/web/programs/083964-021-A

Get stream data (require cookies)
With header(`authorization: Bearer <token>`)
https://api.arte.tv/api/player/v2/config/en/083964-021-A

Token value can be obtained via `apiplayer.token`:
https://static-cdn.arte.tv/static/artevp/5.3.3/config/json/general.json
