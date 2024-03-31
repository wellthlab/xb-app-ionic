import { useQuery } from '@tanstack/react-query';

import { getDb } from '@/realm';

export function useStudy() {
    return useQuery({
        queryKey: ['study'],

        queryFn: async () => {
            return getDb()!.collection('studyInfo').findOne({});
        },
    });
}
