from rest_framework import serializers

from .models import Candidate


class CandidateSerializer(serializers.ModelSerializer):

    class Meta:

        model = Candidate

        fields = [
            'name',
            'email',
            'phone',
            'college',
            'position',
            'token_number',
            'status',
        ]